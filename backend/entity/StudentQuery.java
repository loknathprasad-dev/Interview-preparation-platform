package com.interfinix.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "queries")
public class StudentQuery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "query_id")
    private Integer queryId;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "domain_id", nullable = false)
    private Integer domainId;

    @Column(name = "query_text", nullable = false)
    private String queryText;

    @Column(name = "reply_text")
    private String replyText;

    @Column(name = "replied_by")
    private Integer repliedBy;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "replied_at")
    private LocalDateTime repliedAt;
}