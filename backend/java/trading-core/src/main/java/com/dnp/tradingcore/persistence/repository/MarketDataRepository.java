package com.dnp.tradingcore.persistence.repository;

import com.dnp.tradingcore.persistence.entity.MarketDataEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MarketDataRepository extends JpaRepository<MarketDataEntity, String> {
    List<MarketDataEntity> findAllByOrderByTimestampDesc(Pageable pageable);

    List<MarketDataEntity> findBySymbolIgnoreCaseOrderByTimestampDesc(String symbol, Pageable pageable);

    Optional<MarketDataEntity> findFirstBySymbolIgnoreCaseOrderByTimestampDesc(String symbol);
}
