package com.dnp.tradingcore.service;

import com.dnp.tradingcore.domain.ExecutionResult;
import com.dnp.tradingcore.domain.ExecutionStatus;
import com.dnp.tradingcore.domain.Order;
import com.dnp.tradingcore.domain.OrderSide;
import com.dnp.tradingcore.domain.OrderStatus;
import com.dnp.tradingcore.domain.OrderType;
import com.dnp.tradingcore.domain.Signal;
import com.dnp.tradingcore.dto.MarketDataMessage;
import com.dnp.tradingcore.dto.request.CreateOrderRequest;
import com.dnp.tradingcore.exception.BadRequestException;
import com.dnp.tradingcore.exception.NotFoundException;
import com.dnp.tradingcore.messaging.OrderPublisher;
import com.dnp.tradingcore.persistence.entity.ExecutionResultEntity;
import com.dnp.tradingcore.persistence.entity.MarketDataEntity;
import com.dnp.tradingcore.persistence.entity.OrderEntity;
import com.dnp.tradingcore.persistence.entity.PortfolioEntity;
import com.dnp.tradingcore.persistence.entity.PositionEntity;
import com.dnp.tradingcore.persistence.entity.SignalEntity;
import com.dnp.tradingcore.persistence.repository.ExecutionResultRepository;
import com.dnp.tradingcore.persistence.repository.MarketDataRepository;
import com.dnp.tradingcore.persistence.repository.OrderRepository;
import com.dnp.tradingcore.persistence.repository.PortfolioRepository;
import com.dnp.tradingcore.persistence.repository.PositionRepository;
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
    private final MarketDataRepository marketDataRepository;
    private final PositionRepository positionRepository;
    private final OrderPublisher orderPublisher;

    public TradingCoreService(
            SignalRepository signalRepository,
            OrderRepository orderRepository,
            ExecutionResultRepository executionResultRepository,
            PortfolioRepository portfolioRepository,
            MarketDataRepository marketDataRepository,
            PositionRepository positionRepository,
            OrderPublisher orderPublisher
    ) {
        this.signalRepository = signalRepository;
        this.orderRepository = orderRepository;
        this.executionResultRepository = executionResultRepository;
        this.portfolioRepository = portfolioRepository;
        this.marketDataRepository = marketDataRepository;
        this.positionRepository = positionRepository;
        this.orderPublisher = orderPublisher;
    }

    @Transactional
    public void processMarketData(MarketDataMessage message) {
        if (message.eventId() == null || message.eventId().isBlank()) {
            throw new BadRequestException("Market data eventId is required");
        }
        if (message.symbol() == null || message.symbol().isBlank()) {
            throw new BadRequestException("Market data symbol is required");
        }

        Instant timestamp = safeTimestamp(message.timestamp());
        MarketDataEntity entity = new MarketDataEntity();
        entity.setEventId(message.eventId());
        entity.setSymbol(message.symbol());
        entity.setPrice(zeroIfNull(message.price()));
        entity.setVolume(zeroIfNull(message.volume()));
        entity.setTimestamp(timestamp);
        marketDataRepository.save(entity);

        portfolioRepository.findById(DEFAULT_PORTFOLIO_ID)
                .flatMap(portfolio -> positionRepository.findByPortfolioIdAndSymbolIgnoreCase(portfolio.getId(), message.symbol())
                        .map(position -> updatePositionMarketPrice(portfolio, position, entity.getPrice(), timestamp)))
                .ifPresent(portfolioRepository::save);
    }

    @Transactional
    public Order processSignal(Signal signal) {
        saveSignal(signal);

        Order order = new Order(
                UUID.randomUUID().toString(),
                signal.signalId(),
                signal.symbol(),
                signal.side(),
                positiveQuantity(signal.quantity()),
                OrderType.MARKET,
                null,
                OrderStatus.NEW,
                safeTimestamp(signal.timestamp())
        );

        saveAndPublishOrder(order);
        return order;
    }

    @Transactional
    public OrderEntity createOrder(CreateOrderRequest request) {
        if (request == null) {
            throw new BadRequestException("Order request body is required");
        }

        OrderType orderType = request.orderType() != null ? request.orderType() : OrderType.MARKET;
        if (request.symbol() == null || request.symbol().isBlank()) {
            throw new BadRequestException("Order symbol is required");
        }
        if (request.side() == null) {
            throw new BadRequestException("Order side is required");
        }
        BigDecimal quantity = positiveQuantity(request.quantity());
        if (orderType == OrderType.LIMIT && request.limitPrice() == null) {
            throw new BadRequestException("limitPrice is required for LIMIT orders");
        }

        Order order = new Order(
                UUID.randomUUID().toString(),
                null,
                request.symbol(),
                request.side(),
                quantity,
                orderType,
                orderType == OrderType.LIMIT ? request.limitPrice() : null,
                OrderStatus.NEW,
                Instant.now()
        );

        return saveAndPublishOrder(order);
    }

    @Transactional
    public OrderEntity cancelOrder(String orderId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        if (OrderStatus.FILLED.name().equals(order.getStatus())) {
            throw new BadRequestException("Filled order cannot be cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED.name());
        return orderRepository.save(order);
    }

    @Transactional
    public void processExecutionResult(ExecutionResult result) {
        saveExecution(result);
        ExecutionStatus status = result.status() != null ? result.status() : ExecutionStatus.REJECTED;
        orderRepository.findById(result.orderId()).ifPresent(order -> {
            order.setStatus(orderStatusFor(status).name());
            orderRepository.save(order);
        });

        if (status != ExecutionStatus.FILLED) {
            return;
        }

        PortfolioEntity portfolio = portfolioRepository.findById(DEFAULT_PORTFOLIO_ID)
                .orElseGet(this::newDefaultPortfolio);

        PositionEntity position = findOrCreatePosition(portfolio, result.symbol());
        BigDecimal quantity = positiveQuantity(result.quantity());
        BigDecimal executedPrice = positivePrice(result.executedPrice());
        BigDecimal notional = executedPrice.multiply(quantity);
        BigDecimal realizedDelta = BigDecimal.ZERO;

        if (result.side() == OrderSide.BUY) {
            portfolio.setCashBalance(zeroIfNull(portfolio.getCashBalance()).subtract(notional));

            BigDecimal oldQuantity = zeroIfNull(position.getQuantity());
            BigDecimal totalCost = zeroIfNull(position.getAveragePrice()).multiply(oldQuantity).add(notional);
            BigDecimal newQuantity = oldQuantity.add(quantity);
            BigDecimal newAveragePrice = newQuantity.compareTo(BigDecimal.ZERO) == 0
                    ? BigDecimal.ZERO
                    : totalCost.divide(newQuantity, 8, RoundingMode.HALF_UP);

            position.setQuantity(newQuantity);
            position.setAveragePrice(newAveragePrice);
        } else {
            portfolio.setCashBalance(zeroIfNull(portfolio.getCashBalance()).add(notional));

            BigDecimal oldQuantity = zeroIfNull(position.getQuantity());
            BigDecimal matchedQuantity = oldQuantity.min(quantity);
            realizedDelta = executedPrice
                    .subtract(zeroIfNull(position.getAveragePrice()))
                    .multiply(matchedQuantity);

            BigDecimal newQuantity = oldQuantity.subtract(quantity).max(BigDecimal.ZERO);
            position.setQuantity(newQuantity);
            if (newQuantity.compareTo(BigDecimal.ZERO) == 0) {
                position.setAveragePrice(BigDecimal.ZERO);
            }
        }

        Instant timestamp = safeTimestamp(result.timestamp());
        position.setLatestPrice(executedPrice);
        position.setUnrealizedPnl(calculateUnrealizedPnl(position, executedPrice));
        position.setUpdatedAt(timestamp);
        position.setPortfolio(portfolio);

        portfolio.setRealizedPnl(zeroIfNull(portfolio.getRealizedPnl()).add(realizedDelta));
        portfolio.setUpdatedAt(timestamp);

        portfolioRepository.save(portfolio);
    }

    private OrderEntity saveAndPublishOrder(Order order) {
        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setOrderId(order.orderId());
        orderEntity.setSignalId(order.signalId());
        orderEntity.setSymbol(order.symbol());
        orderEntity.setSide(order.side());
        orderEntity.setQuantity(order.quantity());
        orderEntity.setOrderType(order.orderType().name());
        orderEntity.setRequestedPrice(order.limitPrice());
        orderEntity.setTimestamp(order.timestamp());
        orderEntity.setStatus(order.status().name());
        OrderEntity saved = orderRepository.save(orderEntity);

        orderPublisher.publish(order);
        return saved;
    }

    private void saveSignal(Signal signal) {
        SignalEntity entity = new SignalEntity();
        entity.setSignalId(signal.signalId());
        entity.setSymbol(signal.symbol());
        entity.setSide(signal.side());
        entity.setQuantity(positiveQuantity(signal.quantity()));
        entity.setTargetPrice(zeroIfNull(signal.targetPrice()));
        entity.setReason(signal.reason());
        entity.setTimestamp(safeTimestamp(signal.timestamp()));
        signalRepository.save(entity);
    }

    private void saveExecution(ExecutionResult result) {
        ExecutionResultEntity entity = new ExecutionResultEntity();
        entity.setExecutionId(result.executionId());
        entity.setOrderId(result.orderId());
        entity.setSymbol(result.symbol());
        entity.setSide(result.side());
        entity.setQuantity(positiveQuantity(result.quantity()));
        entity.setExecutedPrice(positivePrice(result.executedPrice()));
        entity.setStatus(result.status() != null ? result.status() : ExecutionStatus.REJECTED);
        entity.setMarketDataEventId(result.marketDataEventId());
        entity.setPriceTimestamp(result.priceTimestamp());
        entity.setTimestamp(safeTimestamp(result.timestamp()));
        executionResultRepository.save(entity);
    }

    private PortfolioEntity updatePositionMarketPrice(
            PortfolioEntity portfolio,
            PositionEntity position,
            BigDecimal latestPrice,
            Instant timestamp
    ) {
        position.setLatestPrice(latestPrice);
        position.setUnrealizedPnl(calculateUnrealizedPnl(position, latestPrice));
        position.setUpdatedAt(timestamp);
        portfolio.setUpdatedAt(timestamp);
        return portfolio;
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
                .filter(position -> symbol.equalsIgnoreCase(position.getSymbol()))
                .findFirst();

        if (existing.isPresent()) {
            return existing.get();
        }

        PositionEntity position = new PositionEntity();
        position.setSymbol(symbol);
        position.setQuantity(BigDecimal.ZERO);
        position.setAveragePrice(BigDecimal.ZERO);
        position.setLatestPrice(BigDecimal.ZERO);
        position.setUnrealizedPnl(BigDecimal.ZERO);
        position.setUpdatedAt(Instant.now());
        position.setPortfolio(portfolio);
        portfolio.getPositions().add(position);
        return position;
    }

    private OrderStatus orderStatusFor(ExecutionStatus executionStatus) {
        return executionStatus == ExecutionStatus.FILLED ? OrderStatus.FILLED : OrderStatus.REJECTED;
    }

    private BigDecimal calculateUnrealizedPnl(PositionEntity position, BigDecimal latestPrice) {
        return latestPrice
                .subtract(zeroIfNull(position.getAveragePrice()))
                .multiply(zeroIfNull(position.getQuantity()));
    }

    private BigDecimal positiveQuantity(BigDecimal quantity) {
        BigDecimal value = zeroIfNull(quantity);
        if (value.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Quantity must be positive");
        }
        return value;
    }

    private BigDecimal positivePrice(BigDecimal price) {
        BigDecimal value = zeroIfNull(price);
        if (value.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Price cannot be negative");
        }
        return value;
    }

    private BigDecimal zeroIfNull(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private Instant safeTimestamp(Instant timestamp) {
        return timestamp != null ? timestamp : Instant.now();
    }
}
