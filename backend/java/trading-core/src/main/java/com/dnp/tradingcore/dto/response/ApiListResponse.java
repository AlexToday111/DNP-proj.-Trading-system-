package com.dnp.tradingcore.dto.response;

import java.util.List;

public record ApiListResponse<T>(
        List<T> items
) {
}
