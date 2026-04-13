package com.dnp.tradingcore.persistence.repository;

import com.dnp.tradingcore.persistence.entity.ExecutionResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExecutionResultRepository extends JpaRepository<ExecutionResultEntity, String> {
}
