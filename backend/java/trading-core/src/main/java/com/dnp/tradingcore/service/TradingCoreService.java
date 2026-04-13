package com.dnp.tradingcore.service;

import com.dnp.tradingcore.domain.ExecutionResult;
import com.dnp.tradingcore.domain.ExecutionStatus;
import com.dnp.tradingcore.domain.Order;
import com.dnp.tradingcore.domain.OrderSide;
import com.dnp.tradingcore.domain.Signal;
import com.dnp.tradingcore.messaging.OrderPublisher;
import com.dnp.tradingcore.persistence.entity.ExecutionResultEntity;
import com.dnp.tradingcore.persistence.entity.OrderEntity;
import com.dnp.tradingcore.persistence.entity.PortfolioEntity;
import com.dnp.tradingcore.persistence.entity.PositionEntity;
import com.dnp.tradingcore.persistence.entity.SignalEntity;
import com.dnp.tradingcore.persistence.repository.ExecutionResultRepository;
import com.dnp.tradingcore.persistence.repository.OrderRepository;
import com.dnp.tradingcore.persistence.repository.PortfolioRepository;
import com.dnp.tradingcore.persistence.repository.SignalRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class TradingCoreService {
    public static final long DEFAULT_PORTFOLIO_ID = 1L;
    public static final BigDecimal DEFAULT_CASH_BALANCE = new BigDecimal("100000.00");

    private final SignalRepository signalRepository;
    private final OrderRepository orderRepository;
    private final ExecutionResultRepository executionResultRepository;
    private final PortfolioRepository portfolioRepository;
    private final OrderPublisher orderPublisher;

    public TradingCoreService(
            SignalRepository signalRepository,
            OrderRepository orderRepository,
            ExecutionResultRepository executionResultRepository,
            PortfolioRepository portfolioRepository,
            OrderPublisher orderPublisher
    ) {
        this.signalRepository = signalRepository;
        this.orderRepository = orderRepository;
        this.executionResultRepository = executionResultRepository;
        this.portfolioRepository = portfolioRepository;
        this.orderPublisher = orderPublisher;
    }

    @Transactional
    public Order processSignal(Signal signal) {
        saveSignal(signal);

        Order order = new Order(
                UUID.randomUUID().toString(),
                signal.signalId(),
                signal.symbol(),
                signal.side(),
                signal.quantity(),
                signal.targetPrice(),
                safeTimestamp(signal.timestamp())
        );

        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setOrderId(order.orderId());
        orderEntity.setSignalId(order.signalId());
        orderEntity.setSymbol(order.symbol());
        orderEntity.setSide(order.side());
        orderEntity.setQuantity(order.quantity());
        orderEntity.setRequestedPrice(order.requestedPrice());
        orderEntity.setTimestamp(order.timestamp());
        orderEntity.setStatus("CREATED");
        orderRepository.save(orderEntity);

        orderPublisher.publish(order);
        return order;
    }

    @Transactional
    public void processExecutionResult(ExecutionResult result) {
        saveExecution(result);
        orderRepository.findById(result.orderId()).ifPresent(order -> {
            order.setStatus(result.status().name());
            orderRepository.save(order);
        });

        if (result.status() != ExecutionStatus.FILLED) {
            return;
        }

        PortfolioEntity portfolio = portfolioRepository.findById(DEFAULT_PORTFOLIO_ID)
                .orElseGet(this::newDefaultPortfolio);

        PositionEntity position = findOrCreatePosition(portfolio, result.symbol());
        BigDecimal notional = result.executedPrice().multiply(result.quantity());
        BigDecimal realizedDelta = BigDecimal.ZERO;

        if (result.side() == OrderSide.BUY) {
            portfolio.setCashBalance(portfolio.getCashBalance().subtract(notional));

            BigDecimal totalCost = position.getAveragePrice().multiply(position.getQuantity()).add(notional);
            BigDecimal newQty = position.getQuantity().add(result.quantity());
            BigDecimal newAvg = newQty.compareTo(BigDecimal.ZERO) == 0
                    ? BigDecimal.ZERO
                    : totalCost.divide(newQty, 8, RoundingMode.HALF_UP);

            position.setQuantity(newQty);
            position.setAveragePrice(newAvg);
        } else {
            portfolio.setCashBalance(portfolio.getCashBalance().add(notional));
            realizedDelta = result.executedPrice()
                    .subtract(position.getAveragePrice())
                    .multiply(result.quantity());

            BigDecimal newQty = position.getQuantity().subtract(result.quantity());
            position.setQuantity(newQty.max(BigDecimal.ZERO));
            if (position.getQuantity().compareTo(BigDecimal.ZERO) == 0) {
                position.setAveragePrice(BigDecimal.ZERO);
            }
        }

        portfolio.setRealizedPnl(portfolio.getRealizedPnl().add(realizedDelta));
        position.setUnrealizedPnl(BigDecimal.ZERO);
        position.setPortfolio(portfolio);
        portfolio.setUpdatedAt(safeTimestamp(result.timestamp()));

        portfolioRepository.save(portfolio);
    }

    private void saveSignal(Signal signal) {
        SignalEntity entity = new SignalEntity();
        entity.setSignalId(signal.signalId());
        entity.setSymbol(signal.symbol());
        entity.setSide(signal.side());
        entity.setQuantity(signal.quantity());
        entity.setTargetPrice(signal.targetPrice());
        entity.setTimestamp(safeTimestamp(signal.timestamp()));
        signalRepository.save(entity);
    }

    private void saveExecution(ExecutionResult result) {
        ExecutionResultEntity entity = new ExecutionResultEntity();
        entity.setExecutionId(result.executionId());
        entity.setOrderId(result.orderId());
        entity.setSymbol(result.symbol());
        entity.setSide(result.side());
        entity.setQuantity(result.quantity());
        entity.setExecutedPrice(result.executedPrice());
        entity.setStatus(result.status());
        entity.setTimestamp(safeTimestamp(result.timestamp()));
        executionResultRepository.save(entity);
    }

    private PortfolioEntity newDefaultPortfolio() {
        PortfolioEntity portfolio = new PortfolioEntity();
        portfolio.setId(DEFAULT_PORTFOLIO_ID);
        portfolio.setCashBalance(DEFAULT_CASH_BALANCE);
        portfolio.setRealizedPnl(BigDecimal.ZERO);
        portfolio.setUpdatedAt(Instant.now());
        return portfolio;
    }

    private PositionEntity findOrCreatePosition(PortfolioEntity portfolio, String symbol) {
        Optional<PositionEntity> existing = portfolio.getPositions().stream()
                .filter(position -> symbol.equals(position.getSymbol()))
                .findFirst();

        if (existing.isPresent()) {
            return existing.get();
        }

        PositionEntity position = new PositionEntity();
        position.setSymbol(symbol);
        position.setQuantity(BigDecimal.ZERO);
        position.setAveragePrice(BigDecimal.ZERO);
        position.setUnrealizedPnl(BigDecimal.ZERO);
        position.setPortfolio(portfolio);
        portfolio.getPositions().add(position);
        return position;
    }

    private Instant safeTimestamp(Instant timestamp) {
        return timestamp != null ? timestamp : Instant.now();
    }
}
