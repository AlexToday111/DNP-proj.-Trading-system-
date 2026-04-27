package com.dnp.tradingcore.service;

import com.dnp.tradingcore.domain.ExecutionStatus;
import com.dnp.tradingcore.domain.OrderSide;
import com.dnp.tradingcore.dto.response.ApiListResponse;
import com.dnp.tradingcore.dto.response.DashboardResponse;
import com.dnp.tradingcore.dto.response.DashboardSystemStatusResponse;
import com.dnp.tradingcore.dto.response.ExecutionResultResponse;
import com.dnp.tradingcore.dto.response.MarketDataResponse;
import com.dnp.tradingcore.dto.response.MarketHistoryResponse;
import com.dnp.tradingcore.dto.response.OrderExecutionsResponse;
import com.dnp.tradingcore.dto.response.OrderResponse;
import com.dnp.tradingcore.dto.response.PortfolioSnapshotResponse;
import com.dnp.tradingcore.dto.response.PositionResponse;
import com.dnp.tradingcore.dto.response.SignalResponse;
import com.dnp.tradingcore.exception.NotFoundException;
import com.dnp.tradingcore.mapper.TradingCoreMapper;
import com.dnp.tradingcore.persistence.entity.ExecutionResultEntity;
import com.dnp.tradingcore.persistence.entity.MarketDataEntity;
import com.dnp.tradingcore.persistence.entity.OrderEntity;
import com.dnp.tradingcore.persistence.entity.SignalEntity;
import com.dnp.tradingcore.persistence.repository.ExecutionResultRepository;
import com.dnp.tradingcore.persistence.repository.MarketDataRepository;
import com.dnp.tradingcore.persistence.repository.OrderRepository;
import com.dnp.tradingcore.persistence.repository.PortfolioRepository;
import com.dnp.tradingcore.persistence.repository.PositionRepository;
import com.dnp.tradingcore.persistence.repository.SignalRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.function.Predicate;

@Service
public class TradingQueryService {
    private static final int DEFAULT_LIMIT = 50;
    private static final int MAX_LIMIT = 500;

    private final MarketDataRepository marketDataRepository;
    private final SignalRepository signalRepository;
    private final OrderRepository orderRepository;
    private final ExecutionResultRepository executionResultRepository;
    private final PortfolioRepository portfolioRepository;
    private final PositionRepository positionRepository;
    private final TradingCoreMapper mapper;

    public TradingQueryService(
            MarketDataRepository marketDataRepository,
            SignalRepository signalRepository,
            OrderRepository orderRepository,
            ExecutionResultRepository executionResultRepository,
            PortfolioRepository portfolioRepository,
            PositionRepository positionRepository,
            TradingCoreMapper mapper
    ) {
        this.marketDataRepository = marketDataRepository;
        this.signalRepository = signalRepository;
        this.orderRepository = orderRepository;
        this.executionResultRepository = executionResultRepository;
        this.portfolioRepository = portfolioRepository;
        this.positionRepository = positionRepository;
        this.mapper = mapper;
    }

    @Transactional
    public DashboardResponse dashboard() {
        int dashboardLimit = 10;
        return new DashboardResponse(
                new DashboardSystemStatusResponse("UP"),
                latestMarketData(null, dashboardLimit).items(),
                latestSignals(null, null, dashboardLimit).items(),
                latestOrders(null, null, null, dashboardLimit).items(),
                latestExecutions(null, null, dashboardLimit).items(),
                portfolio()
        );
    }

    @Transactional
    public ApiListResponse<MarketDataResponse> latestMarketData(String symbol, Integer limit) {
        List<MarketDataEntity> entities = hasText(symbol)
                ? marketDataRepository.findBySymbolIgnoreCaseOrderByTimestampDesc(symbol, page(limit))
                : marketDataRepository.findAllByOrderByTimestampDesc(page(limit));

        return new ApiListResponse<>(entities.stream()
                .map(mapper::toMarketDataResponse)
                .toList());
    }

    @Transactional
    public MarketDataResponse latestMarketDataBySymbol(String symbol) {
        return marketDataRepository.findFirstBySymbolIgnoreCaseOrderByTimestampDesc(symbol)
                .map(mapper::toMarketDataResponse)
                .orElseThrow(() -> new NotFoundException("Market data not found"));
    }

    @Transactional
    public MarketHistoryResponse marketHistory(String symbol, Integer limit, Instant from, Instant to) {
        List<MarketDataEntity> entities = marketDataRepository
                .findBySymbolIgnoreCaseOrderByTimestampDesc(symbol, page(limit == null ? 100 : limit))
                .stream()
                .filter(inRange(from, to))
                .sorted(Comparator.comparing(MarketDataEntity::getTimestamp))
                .toList();

        return new MarketHistoryResponse(symbol, entities.stream()
                .map(mapper::toMarketHistoryPoint)
                .toList());
    }

    @Transactional
    public ApiListResponse<SignalResponse> latestSignals(String symbol, OrderSide side, Integer limit) {
        List<SignalEntity> entities = hasText(symbol)
                ? signalRepository.findBySymbolIgnoreCaseOrderByTimestampDesc(symbol, page(limit))
                : signalRepository.findAllByOrderByTimestampDesc(page(limit));

        return new ApiListResponse<>(entities.stream()
                .filter(entity -> side == null || entity.getSide() == side)
                .map(mapper::toSignalResponse)
                .toList());
    }

    @Transactional
    public SignalResponse signalById(String signalId) {
        return signalRepository.findById(signalId)
                .map(mapper::toSignalResponse)
                .orElseThrow(() -> new NotFoundException("Signal not found"));
    }

    @Transactional
    public ApiListResponse<OrderResponse> latestOrders(String symbol, String status, OrderSide side, Integer limit) {
        List<OrderEntity> entities = hasText(symbol)
                ? orderRepository.findBySymbolIgnoreCaseOrderByTimestampDesc(symbol, page(limit))
                : orderRepository.findAllByOrderByTimestampDesc(page(limit));

        return new ApiListResponse<>(entities.stream()
                .filter(entity -> !hasText(status) || status.equalsIgnoreCase(entity.getStatus()))
                .filter(entity -> side == null || entity.getSide() == side)
                .map(mapper::toOrderResponse)
                .toList());
    }

    @Transactional
    public OrderResponse orderById(String orderId) {
        return orderRepository.findById(orderId)
                .map(mapper::toOrderResponse)
                .orElseThrow(() -> new NotFoundException("Order not found"));
    }

    @Transactional
    public ApiListResponse<ExecutionResultResponse> latestExecutions(String symbol, ExecutionStatus status, Integer limit) {
        List<ExecutionResultEntity> entities = hasText(symbol)
                ? executionResultRepository.findBySymbolIgnoreCaseOrderByTimestampDesc(symbol, page(limit))
                : executionResultRepository.findAllByOrderByTimestampDesc(page(limit));

        return new ApiListResponse<>(entities.stream()
                .filter(entity -> status == null || entity.getStatus() == status)
                .map(mapper::toExecutionResultResponse)
                .toList());
    }

    @Transactional
    public ExecutionResultResponse executionById(String executionId) {
        return executionResultRepository.findById(executionId)
                .map(mapper::toExecutionResultResponse)
                .orElseThrow(() -> new NotFoundException("Execution result not found"));
    }

    @Transactional
    public OrderExecutionsResponse executionsByOrderId(String orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new NotFoundException("Order not found");
        }

        return new OrderExecutionsResponse(orderId, executionResultRepository.findByOrderIdOrderByTimestampDesc(orderId)
                .stream()
                .map(mapper::toExecutionResultResponse)
                .toList());
    }

    @Transactional
    public PortfolioSnapshotResponse portfolio() {
        return portfolioRepository.findById(TradingCoreService.DEFAULT_PORTFOLIO_ID)
                .map(mapper::toPortfolioSnapshot)
                .orElseGet(() -> mapper.toPortfolioSnapshot(null));
    }

    @Transactional
    public ApiListResponse<PositionResponse> positions() {
        return new ApiListResponse<>(positionRepository
                .findByPortfolioIdOrderBySymbolAsc(TradingCoreService.DEFAULT_PORTFOLIO_ID)
                .stream()
                .map(mapper::toPositionResponse)
                .toList());
    }

    @Transactional
    public PositionResponse positionBySymbol(String symbol) {
        return positionRepository.findByPortfolioIdAndSymbolIgnoreCase(TradingCoreService.DEFAULT_PORTFOLIO_ID, symbol)
                .map(mapper::toPositionResponse)
                .orElseThrow(() -> new NotFoundException("Position not found"));
    }

    private PageRequest page(Integer limit) {
        int value = limit == null ? DEFAULT_LIMIT : limit;
        int normalized = Math.min(Math.max(value, 1), MAX_LIMIT);
        return PageRequest.of(0, normalized);
    }

    private Predicate<MarketDataEntity> inRange(Instant from, Instant to) {
        return entity -> {
            Instant timestamp = entity.getTimestamp();
            if (timestamp == null) {
                return false;
            }
            boolean afterFrom = from == null || !timestamp.isBefore(from);
            boolean beforeTo = to == null || !timestamp.isAfter(to);
            return afterFrom && beforeTo;
        };
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
