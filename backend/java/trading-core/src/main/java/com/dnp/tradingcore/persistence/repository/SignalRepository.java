package com.dnp.tradingcore.persistence.repository;

import com.dnp.tradingcore.persistence.entity.SignalEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SignalRepository extends JpaRepository<SignalEntity, String> {
    List<SignalEntity> findAllByOrderByTimestampDesc(Pageable pageable);

    List<SignalEntity> findBySymbolIgnoreCaseOrderByTimestampDesc(String symbol, Pageable pageable);
}
