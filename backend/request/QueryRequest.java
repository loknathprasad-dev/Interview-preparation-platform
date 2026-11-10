package com.interfinix.backend.request;

import lombok.Data;

@Data
public class QueryRequest {

    private Integer domainId;
    private String queryText;
    private String replyText;
}