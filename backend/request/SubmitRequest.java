package com.interfinix.backend.request;

import java.util.List;

import lombok.Data;

@Data
public class SubmitRequest {

    private Integer domainId;
    private List<Item> answers;

    @Data
    public static class Item {
        private Integer questionId;
        private String answerText;
    }
}