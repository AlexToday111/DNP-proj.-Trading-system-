package com.dnp.tradingcore.persistence.repository;

import com.dnp.tradingcore.persistence.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderEntity, String> {
}
