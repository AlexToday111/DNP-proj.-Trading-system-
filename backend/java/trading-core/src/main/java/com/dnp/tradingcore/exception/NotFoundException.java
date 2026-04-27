package com.dnp.tradingcore.exception;

public class NotFoundException extends ApiException {
    public NotFoundException(String message) {
        super(ErrorCode.NOT_FOUND, message);
    }
}
