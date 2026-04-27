package com.dnp.tradingcore.persistence.repository;

import com.dnp.tradingcore.persistence.entity.PositionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PositionRepository extends JpaRepository<PositionEntity, Long> {
    List<PositionEntity> findByPortfolioIdOrderBySymbolAsc(Long portfolioId);

    Optional<PositionEntity> findByPortfolioIdAndSymbolIgnoreCase(Long portfolioId, String symbol);
}
