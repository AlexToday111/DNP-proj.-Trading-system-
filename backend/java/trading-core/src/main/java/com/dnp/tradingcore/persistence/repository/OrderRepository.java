package com.dnp.tradingcore.persistence.repository;

import com.dnp.tradingcore.persistence.entity.OrderEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, String> {
    List<OrderEntity> findAllByOrderByTimestampDesc(Pageable pageable);

    List<OrderEntity> findBySymbolIgnoreCaseOrderByTimestampDesc(String symbol, Pageable pageable);
}
