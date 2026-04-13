package com.dnp.tradingcore.persistence.repository;

import com.dnp.tradingcore.persistence.entity.SignalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SignalRepository extends JpaRepository<SignalEntity, String> {
}
