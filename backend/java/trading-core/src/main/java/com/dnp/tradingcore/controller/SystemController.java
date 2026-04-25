package com.dnp.tradingcore.controller;

import com.dnp.tradingcore.dto.response.SystemServiceResponse;
import com.dnp.tradingcore.dto.response.SystemStatusResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/system")
public class SystemController {
    @GetMapping("/status")
    public SystemStatusResponse status() {
        // TODO: replace static dependency statuses with active Kafka/PostgreSQL/Go service health checks.
        return new SystemStatusResponse(
                "UP",
                List.of(
                        new SystemServiceResponse("trading-core", "UP", "JAVA_CORE"),
                        new SystemServiceResponse("market-data-service", "UNKNOWN", "GO_SERVICE"),
                        new SystemServiceResponse("strategy-service", "UNKNOWN", "BACKEND_SERVICE"),
                        new SystemServiceResponse("execution-sim-service", "UNKNOWN", "GO_SERVICE"),
                        new SystemServiceResponse("kafka", "UNKNOWN", "MESSAGE_BROKER"),
                        new SystemServiceResponse("postgresql", "UNKNOWN", "DATABASE")
                ),
                Instant.now()
        );
    }
}
