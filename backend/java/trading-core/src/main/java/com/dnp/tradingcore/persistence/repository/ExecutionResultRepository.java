package com.dnp.tradingcore.persistence.repository;

import com.dnp.tradingcore.persistence.entity.ExecutionResultEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExecutionResultRepository extends JpaRepository<ExecutionResultEntity, String> {
    List<ExecutionResultEntity> findAllByOrderByTimestampDesc(Pageable pageable);

    List<ExecutionResultEntity> findBySymbolIgnoreCaseOrderByTimestampDesc(String symbol, Pageable pageable);

    List<ExecutionResultEntity> findByOrderIdOrderByTimestampDesc(String orderId);
}
