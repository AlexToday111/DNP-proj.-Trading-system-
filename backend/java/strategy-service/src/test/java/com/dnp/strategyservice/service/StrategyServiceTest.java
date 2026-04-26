package com.dnp.strategyservice.service;

import com.dnp.strategyservice.domain.OrderSide;
import com.dnp.strategyservice.dto.MarketDataMessage;
import com.dnp.strategyservice.dto.SignalMessage;
import com.dnp.strategyservice.messaging.SignalPublisher;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

class StrategyServiceTest {
    @Test
    void processMarketData_firstValidEventPublishesBuySignal() {
        SignalPublisher signalPublisher = mock(SignalPublisher.class);
        StrategyService strategyService = new StrategyService(signalPublisher, new BigDecimal("2"));

        Optional<SignalMessage> signal = strategyService.processMarketData(marketData("md-1", " btcusdt ", "100.00"));

        assertThat(signal).isPresent();
        assertThat(signal.get().symbol()).isEqualTo("BTCUSDT");
        assertThat(signal.get().side()).isEqualTo(OrderSide.BUY);
        assertThat(signal.get().quantity()).isEqualByComparingTo("2");
        assertThat(signal.get().price()).isEqualByComparingTo("100.00");
        assertThat(signal.get().reason()).isEqualTo("FIRST_MARKET_DATA");

        verify(signalPublisher).publish(signal.get());
    }

    @Test
    void processMarketData_priceIncreasePublishesBuySignal() {
        SignalPublisher signalPublisher = mock(SignalPublisher.class);
        StrategyService strategyService = new StrategyService(signalPublisher, BigDecimal.ONE);

        strategyService.processMarketData(marketData("md-1", "AAPL", "100.00"));
        Optional<SignalMessage> signal = strategyService.processMarketData(marketData("md-2", "AAPL", "101.00"));

        assertThat(signal).isPresent();
        assertThat(signal.get().side()).isEqualTo(OrderSide.BUY);
        assertThat(signal.get().reason()).isEqualTo("MOMENTUM_UP");
    }

    @Test
    void processMarketData_priceDecreasePublishesSellSignal() {
        SignalPublisher signalPublisher = mock(SignalPublisher.class);
        StrategyService strategyService = new StrategyService(signalPublisher, BigDecimal.ONE);

        strategyService.processMarketData(marketData("md-1", "AAPL", "100.00"));
        Optional<SignalMessage> signal = strategyService.processMarketData(marketData("md-2", "AAPL", "99.00"));

        assertThat(signal).isPresent();
        assertThat(signal.get().side()).isEqualTo(OrderSide.SELL);
        assertThat(signal.get().reason()).isEqualTo("MOMENTUM_DOWN");
    }

    @Test
    void processMarketData_unchangedPriceDoesNotPublishSignal() {
        SignalPublisher signalPublisher = mock(SignalPublisher.class);
        StrategyService strategyService = new StrategyService(signalPublisher, BigDecimal.ONE);

        strategyService.processMarketData(marketData("md-1", "AAPL", "100.00"));
        Optional<SignalMessage> signal = strategyService.processMarketData(marketData("md-2", "AAPL", "100.00"));

        assertThat(signal).isEmpty();
        ArgumentCaptor<SignalMessage> captor = ArgumentCaptor.forClass(SignalMessage.class);
        verify(signalPublisher).publish(captor.capture());
        assertThat(captor.getAllValues()).hasSize(1);
    }

    @Test
    void processMarketData_invalidEventDoesNotPublishSignal() {
        SignalPublisher signalPublisher = mock(SignalPublisher.class);
        StrategyService strategyService = new StrategyService(signalPublisher, BigDecimal.ONE);

        Optional<SignalMessage> signal = strategyService.processMarketData(marketData("md-1", "AAPL", "0"));

        assertThat(signal).isEmpty();
        verify(signalPublisher, never()).publish(org.mockito.ArgumentMatchers.any());
    }

    private MarketDataMessage marketData(String eventId, String symbol, String price) {
        return new MarketDataMessage(
                eventId,
                symbol,
                new BigDecimal(price),
                new BigDecimal("1000"),
                Instant.parse("2026-04-25T10:00:00Z")
        );
    }
}
