package com.dnp.tradingcore.persistence.repository;

import com.dnp.tradingcore.persistence.entity.PortfolioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioRepository extends JpaRepository<PortfolioEntity, Long> {
}
