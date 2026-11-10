package com.interfinix.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "submission_id")
    private Integer submissionId;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "domain_id", nullable = false)
    private Integer domainId;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "total_marks")
    private BigDecimal totalMarks;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "checked_at")
    private LocalDateTime checkedAt;
}