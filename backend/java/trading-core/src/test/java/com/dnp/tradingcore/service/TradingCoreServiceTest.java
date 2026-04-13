package com.dnp.tradingcore.service;

import com.dnp.tradingcore.domain.ExecutionResult;
import com.dnp.tradingcore.domain.ExecutionStatus;
import com.dnp.tradingcore.domain.Order;
import com.dnp.tradingcore.domain.OrderSide;
import com.dnp.tradingcore.domain.Signal;
import com.dnp.tradingcore.messaging.OrderPublisher;
import com.dnp.tradingcore.persistence.entity.OrderEntity;
import com.dnp.tradingcore.persistence.entity.PortfolioEntity;
import com.dnp.tradingcore.persistence.repository.ExecutionResultRepository;
import com.dnp.tradingcore.persistence.repository.OrderRepository;
import com.dnp.tradingcore.persistence.repository.PortfolioRepository;
import com.dnp.tradingcore.persistence.repository.SignalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TradingCoreServiceTest {
    @Mock
    private SignalRepository signalRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private ExecutionResultRepository executionResultRepository;
    @Mock
    private PortfolioRepository portfolioRepository;
    @Mock
    private OrderPublisher orderPublisher;

    private TradingCoreService service;

    @BeforeEach
    void setUp() {
        service = new TradingCoreService(
                signalRepository,
                orderRepository,
                executionResultRepository,
                portfolioRepository,
                orderPublisher
        );
    }

    @Test
    void processSignal_createsOrderAndPublishes() {
        Signal signal = new Signal(
                "s-1",
                "BTCUSDT",
                OrderSide.BUY,
                new BigDecimal("0.50"),
                new BigDecimal("62000"),
                Instant.parse("2026-04-13T09:00:00Z")
        );

        Order order = service.processSignal(signal);

        assertThat(order.signalId()).isEqualTo("s-1");
        assertThat(order.symbol()).isEqualTo("BTCUSDT");
        assertThat(order.side()).isEqualTo(OrderSide.BUY);

        verify(signalRepository).save(any());
        verify(orderRepository).save(any());
        verify(orderPublisher).publish(order);
    }

    @Test
    void processExecutionResult_buyUpdatesPortfolioCashAndPosition() {
        when(portfolioRepository.findById(TradingCoreService.DEFAULT_PORTFOLIO_ID)).thenReturn(Optional.empty());

        ExecutionResult result = new ExecutionResult(
                "e-1",
                "o-1",
                "BTCUSDT",
                OrderSide.BUY,
                new BigDecimal("1.0"),
                new BigDecimal("100.0"),
                ExecutionStatus.FILLED,
                Instant.parse("2026-04-13T09:30:00Z")
        );

        service.processExecutionResult(result);

        ArgumentCaptor<PortfolioEntity> captor = ArgumentCaptor.forClass(PortfolioEntity.class);
        verify(portfolioRepository).save(captor.capture());

        PortfolioEntity saved = captor.getValue();
        assertThat(saved.getCashBalance()).isEqualByComparingTo("99900.00");
        assertThat(saved.getPositions()).hasSize(1);
        assertThat(saved.getPositions().get(0).getSymbol()).isEqualTo("BTCUSDT");
        assertThat(saved.getPositions().get(0).getQuantity()).isEqualByComparingTo("1.0");
        assertThat(saved.getPositions().get(0).getAveragePrice()).isEqualByComparingTo("100.00000000");
    }

    @Test
    void processExecutionResult_sellUpdatesRealizedPnl() {
        PortfolioEntity portfolio = new PortfolioEntity();
        portfolio.setId(TradingCoreService.DEFAULT_PORTFOLIO_ID);
        portfolio.setCashBalance(new BigDecimal("900.00"));
        portfolio.setRealizedPnl(BigDecimal.ZERO);

        com.dnp.tradingcore.persistence.entity.PositionEntity position = new com.dnp.tradingcore.persistence.entity.PositionEntity();
        position.setSymbol("BTCUSDT");
        position.setQuantity(new BigDecimal("1.0"));
        position.setAveragePrice(new BigDecimal("100.0"));
        position.setUnrealizedPnl(BigDecimal.ZERO);
        position.setPortfolio(portfolio);
        portfolio.getPositions().add(position);

        when(portfolioRepository.findById(TradingCoreService.DEFAULT_PORTFOLIO_ID)).thenReturn(Optional.of(portfolio));
        when(orderRepository.findById("o-2")).thenReturn(Optional.of(new OrderEntity()));

        ExecutionResult result = new ExecutionResult(
                "e-2",
                "o-2",
                "BTCUSDT",
                OrderSide.SELL,
                new BigDecimal("1.0"),
                new BigDecimal("120.0"),
                ExecutionStatus.FILLED,
                Instant.parse("2026-04-13T10:00:00Z")
        );

        service.processExecutionResult(result);

        ArgumentCaptor<PortfolioEntity> captor = ArgumentCaptor.forClass(PortfolioEntity.class);
        verify(portfolioRepository).save(captor.capture());

        PortfolioEntity saved = captor.getValue();
        assertThat(saved.getCashBalance()).isEqualByComparingTo("1020.00");
        assertThat(saved.getRealizedPnl()).isEqualByComparingTo("20.00");
        assertThat(saved.getPositions().get(0).getQuantity()).isEqualByComparingTo("0");
    }
}
