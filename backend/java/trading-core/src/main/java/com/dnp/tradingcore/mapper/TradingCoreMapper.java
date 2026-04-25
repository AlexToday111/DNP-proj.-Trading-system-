package com.dnp.tradingcore.mapper;

import com.dnp.tradingcore.domain.OrderType;
import com.dnp.tradingcore.dto.response.ExecutionResultResponse;
import com.dnp.tradingcore.dto.response.MarketDataResponse;
import com.dnp.tradingcore.dto.response.MarketHistoryPointResponse;
import com.dnp.tradingcore.dto.response.OrderResponse;
import com.dnp.tradingcore.dto.response.PortfolioSnapshotResponse;
import com.dnp.tradingcore.dto.response.PositionResponse;
import com.dnp.tradingcore.dto.response.SignalResponse;
import com.dnp.tradingcore.persistence.entity.ExecutionResultEntity;
import com.dnp.tradingcore.persistence.entity.MarketDataEntity;
import com.dnp.tradingcore.persistence.entity.OrderEntity;
import com.dnp.tradingcore.persistence.entity.PortfolioEntity;
import com.dnp.tradingcore.persistence.entity.PositionEntity;
import com.dnp.tradingcore.persistence.entity.SignalEntity;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Component
public class TradingCoreMapper {
    public MarketDataResponse toMarketDataResponse(MarketDataEntity entity) {
        return new MarketDataResponse(
                entity.getEventId(),
                entity.getSymbol(),
                zeroIfNull(entity.getPrice()),
                zeroIfNull(entity.getVolume()),
                entity.getTimestamp()
        );
    }

    public MarketHistoryPointResponse toMarketHistoryPoint(MarketDataEntity entity) {
        return new MarketHistoryPointResponse(
                zeroIfNull(entity.getPrice()),
                entity.getTimestamp()
        );
    }

    public SignalResponse toSignalResponse(SignalEntity entity) {
        return new SignalResponse(
                entity.getSignalId(),
                entity.getSymbol(),
                entity.getSide(),
                zeroIfNull(entity.getTargetPrice()),
                defaultString(entity.getReason(), "UNKNOWN"),
                entity.getTimestamp()
        );
    }

    public OrderResponse toOrderResponse(OrderEntity entity) {
        return new OrderResponse(
                entity.getOrderId(),
                entity.getSignalId(),
                entity.getSymbol(),
                entity.getSide(),
                zeroIfNull(entity.getQuantity()),
                defaultString(entity.getOrderType(), OrderType.MARKET.name()),
                entity.getRequestedPrice(),
                defaultString(entity.getStatus(), "NEW"),
                entity.getTimestamp()
        );
    }

    public ExecutionResultResponse toExecutionResultResponse(ExecutionResultEntity entity) {
        return new ExecutionResultResponse(
                entity.getExecutionId(),
                entity.getOrderId(),
                entity.getSymbol(),
                entity.getSide(),
                zeroIfNull(entity.getQuantity()),
                zeroIfNull(entity.getExecutedPrice()),
                entity.getStatus(),
                entity.getMarketDataEventId(),
                entity.getPriceTimestamp(),
                entity.getTimestamp()
        );
    }

    public PortfolioSnapshotResponse toPortfolioSnapshot(PortfolioEntity portfolio) {
        if (portfolio == null) {
            return emptyPortfolio();
        }

        List<PositionEntity> positions = portfolio.getPositions();
        BigDecimal totalPositionValue = positions.stream()
                .map(this::marketValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal unrealizedPnl = positions.stream()
                .map(position -> zeroIfNull(position.getUnrealizedPnl()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal realizedPnl = zeroIfNull(portfolio.getRealizedPnl());
        BigDecimal cash = zeroIfNull(portfolio.getCashBalance());

        return new PortfolioSnapshotResponse(
                cash,
                totalPositionValue,
                cash.add(totalPositionValue),
                realizedPnl,
                unrealizedPnl,
                realizedPnl.add(unrealizedPnl),
                portfolio.getUpdatedAt()
        );
    }

    public PositionResponse toPositionResponse(PositionEntity entity) {
        BigDecimal quantity = zeroIfNull(entity.getQuantity());
        BigDecimal latestPrice = latestPrice(entity);

        return new PositionResponse(
                entity.getSymbol(),
                quantity,
                zeroIfNull(entity.getAveragePrice()),
                latestPrice,
                quantity.multiply(latestPrice),
                zeroIfNull(entity.getUnrealizedPnl()),
                entity.getUpdatedAt()
        );
    }

    private PortfolioSnapshotResponse emptyPortfolio() {
        Instant now = Instant.now();
        BigDecimal cash = new BigDecimal("100000.00");
        return new PortfolioSnapshotResponse(
                cash,
                BigDecimal.ZERO,
                cash,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                now
        );
    }

    private BigDecimal marketValue(PositionEntity position) {
        return zeroIfNull(position.getQuantity()).multiply(latestPrice(position));
    }

    private BigDecimal latestPrice(PositionEntity position) {
        BigDecimal latestPrice = position.getLatestPrice();
        return latestPrice != null ? latestPrice : zeroIfNull(position.getAveragePrice());
    }

    private BigDecimal zeroIfNull(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private String defaultString(String value, String defaultValue) {
        return value != null && !value.isBlank() ? value : defaultValue;
    }
}
