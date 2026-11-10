package com.interfinix.backend.request;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class MarksRequest {

    private List<Item> marks;

    @Data
    public static class Item {
        private Integer answerId;
        private BigDecimal marks;
    }
}