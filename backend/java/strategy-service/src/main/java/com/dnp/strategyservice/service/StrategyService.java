package com.dnp.strategyservice.service;

import com.dnp.strategyservice.domain.OrderSide;
import com.dnp.strategyservice.dto.MarketDataMessage;
import com.dnp.strategyservice.dto.SignalMessage;
import com.dnp.strategyservice.messaging.SignalPublisher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StrategyService {
    private static final BigDecimal DEFAULT_SIGNAL_QUANTITY = BigDecimal.ONE;

    private final SignalPublisher signalPublisher;
    private final BigDecimal signalQuantity;
    private final Map<String, BigDecimal> latestPrices = new ConcurrentHashMap<>();

    public StrategyService(
            SignalPublisher signalPublisher,
            @Value("${app.strategy.signal-quantity:1}") BigDecimal signalQuantity
    ) {
        this.signalPublisher = signalPublisher;
        this.signalQuantity = positiveOrDefault(signalQuantity);
    }

    public Optional<SignalMessage> processMarketData(MarketDataMessage marketData) {
        if (!isValid(marketData)) {
            return Optional.empty();
        }

        String symbol = normalizeSymbol(marketData.symbol());
        BigDecimal price = marketData.price();
        BigDecimal previousPrice = latestPrices.put(symbol, price);
        OrderSide side = sideFor(previousPrice, price);

        if (side == null) {
            return Optional.empty();
        }

        SignalMessage signal = new SignalMessage(
                "sig-" + UUID.randomUUID(),
                symbol,
                side,
                signalQuantity,
                price,
                reasonFor(previousPrice, price),
                timestampOrNow(marketData.timestamp())
        );
        signalPublisher.publish(signal);
        return Optional.of(signal);
    }

    private boolean isValid(MarketDataMessage marketData) {
        return marketData != null
                && marketData.symbol() != null
                && !marketData.symbol().isBlank()
                && marketData.price() != null
                && marketData.price().compareTo(BigDecimal.ZERO) > 0;
    }

    private OrderSide sideFor(BigDecimal previousPrice, BigDecimal currentPrice) {
        if (previousPrice == null) {
            return OrderSide.BUY;
        }

        int comparison = currentPrice.compareTo(previousPrice);
        if (comparison > 0) {
            return OrderSide.BUY;
        }
        if (comparison < 0) {
            return OrderSide.SELL;
        }
        return null;
    }

    private String reasonFor(BigDecimal previousPrice, BigDecimal currentPrice) {
        if (previousPrice == null) {
            return "FIRST_MARKET_DATA";
        }
        return currentPrice.compareTo(previousPrice) > 0 ? "MOMENTUM_UP" : "MOMENTUM_DOWN";
    }

    private String normalizeSymbol(String symbol) {
        return symbol.trim().toUpperCase(Locale.ROOT);
    }

    private Instant timestampOrNow(Instant timestamp) {
        return timestamp != null ? timestamp : Instant.now();
    }

    private BigDecimal positiveOrDefault(BigDecimal value) {
        return value != null && value.compareTo(BigDecimal.ZERO) > 0 ? value : DEFAULT_SIGNAL_QUANTITY;
    }
}
