package com.dnp.tradingcore.service;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ServiceHealthTracker {
    public static final String MARKET_DATA_SERVICE = "market-data-service";
    public static final String STRATEGY_SERVICE = "strategy-service";
    public static final String EXECUTION_SIM_SERVICE = "execution-sim-service";

    private static final Duration DEFAULT_FRESHNESS = Duration.ofSeconds(30);

    private final Map<String, Instant> lastKafkaMessages = new ConcurrentHashMap<>();

    public void markKafkaMessage(String serviceName) {
        lastKafkaMessages.put(serviceName, Instant.now());
    }

    public boolean isKafkaServiceFresh(String serviceName) {
        return lastSeen(serviceName)
                .map(lastSeen -> Duration.between(lastSeen, Instant.now()).compareTo(DEFAULT_FRESHNESS) <= 0)
                .orElse(false);
    }

    public boolean hasRecentKafkaActivity() {
        return lastKafkaMessages.keySet().stream().anyMatch(this::isKafkaServiceFresh);
    }

    public Optional<Instant> lastSeen(String serviceName) {
        return Optional.ofNullable(lastKafkaMessages.get(serviceName));
    }
}
