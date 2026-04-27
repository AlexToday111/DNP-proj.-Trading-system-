package com.dnp.tradingcore.controller;

import com.dnp.tradingcore.dto.response.SystemServiceResponse;
import com.dnp.tradingcore.dto.response.SystemStatusResponse;
import com.dnp.tradingcore.service.ServiceHealthTracker;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/system")
public class SystemController {
    private final ServiceHealthTracker serviceHealthTracker;
    private final DataSource dataSource;

    public SystemController(ServiceHealthTracker serviceHealthTracker, DataSource dataSource) {
        this.serviceHealthTracker = serviceHealthTracker;
        this.dataSource = dataSource;
    }

    @GetMapping("/status")
    public SystemStatusResponse status() {
        List<SystemServiceResponse> services = List.of(
                new SystemServiceResponse("trading-core", "UP", "JAVA_CORE"),
                new SystemServiceResponse(
                        "market-data-service",
                        kafkaBackedStatus(ServiceHealthTracker.MARKET_DATA_SERVICE),
                        "GO_SERVICE"
                ),
                new SystemServiceResponse(
                        "strategy-service",
                        kafkaBackedStatus(ServiceHealthTracker.STRATEGY_SERVICE),
                        "JAVA_SERVICE"
                ),
                new SystemServiceResponse(
                        "execution-sim-service",
                        kafkaBackedStatus(ServiceHealthTracker.EXECUTION_SIM_SERVICE),
                        "GO_SERVICE"
                ),
                new SystemServiceResponse("kafka", kafkaStatus(), "MESSAGE_BROKER"),
                new SystemServiceResponse("postgresql", postgresStatus(), "DATABASE")
        );

        return new SystemStatusResponse(
                overallStatus(services),
                services,
                Instant.now()
        );
    }

    private String kafkaBackedStatus(String serviceName) {
        return serviceHealthTracker.isKafkaServiceFresh(serviceName) ? "UP" : "DOWN";
    }

    private String kafkaStatus() {
        return serviceHealthTracker.hasRecentKafkaActivity() ? "UP" : "DOWN";
    }

    private String postgresStatus() {
        try (Connection connection = dataSource.getConnection()) {
            return connection.isValid(1) ? "UP" : "DOWN";
        } catch (SQLException e) {
            return "DOWN";
        }
    }

    private String overallStatus(List<SystemServiceResponse> services) {
        return services.stream().allMatch(service -> "UP".equals(service.status())) ? "UP" : "DEGRADED";
    }
}
