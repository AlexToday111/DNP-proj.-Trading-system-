package com.dnp.tradingcore.controller;

import com.dnp.tradingcore.dto.response.SystemStatusResponse;
import com.dnp.tradingcore.service.ServiceHealthTracker;
import org.junit.jupiter.api.Test;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.groups.Tuple.tuple;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SystemControllerTest {
    @Test
    void status_reportsKafkaBackedServicesUpAfterRecentMessages() throws SQLException {
        ServiceHealthTracker healthTracker = new ServiceHealthTracker();
        healthTracker.markKafkaMessage(ServiceHealthTracker.MARKET_DATA_SERVICE);
        healthTracker.markKafkaMessage(ServiceHealthTracker.STRATEGY_SERVICE);
        healthTracker.markKafkaMessage(ServiceHealthTracker.EXECUTION_SIM_SERVICE);

        SystemController controller = new SystemController(healthTracker, healthyDataSource());

        SystemStatusResponse response = controller.status();

        assertThat(response.status()).isEqualTo("UP");
        assertThat(response.services()).extracting("name", "status")
                .contains(
                        tuple("trading-core", "UP"),
                        tuple("market-data-service", "UP"),
                        tuple("strategy-service", "UP"),
                        tuple("execution-sim-service", "UP"),
                        tuple("kafka", "UP"),
                        tuple("postgresql", "UP")
                );
    }

    @Test
    void status_reportsMissingKafkaMessagesAsDown() throws SQLException {
        SystemController controller = new SystemController(new ServiceHealthTracker(), healthyDataSource());

        SystemStatusResponse response = controller.status();

        assertThat(response.status()).isEqualTo("DEGRADED");
        assertThat(response.services()).extracting("name", "status")
                .contains(
                        tuple("market-data-service", "DOWN"),
                        tuple("strategy-service", "DOWN"),
                        tuple("execution-sim-service", "DOWN"),
                        tuple("kafka", "DOWN"),
                        tuple("postgresql", "UP")
                );
    }

    private DataSource healthyDataSource() throws SQLException {
        Connection connection = mock(Connection.class);
        when(connection.isValid(1)).thenReturn(true);

        DataSource dataSource = mock(DataSource.class);
        when(dataSource.getConnection()).thenReturn(connection);
        return dataSource;
    }
}
