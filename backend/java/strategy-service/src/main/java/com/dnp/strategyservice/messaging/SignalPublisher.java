package com.dnp.strategyservice.messaging;

import com.dnp.strategyservice.dto.SignalMessage;

public interface SignalPublisher {
    void publish(SignalMessage signal);
}
