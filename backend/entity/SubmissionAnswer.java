package com.interfinix.backend.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "answers")
public class SubmissionAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Integer answerId;

    @Column(name = "submission_id", nullable = false)
    private Integer submissionId;

    @Column(name = "question_id")
    private Integer questionId;

    @Column(name = "question_text", nullable = false)
    private String questionText;

    @Column(name = "answer_text")
    private String answerText;

    @Column(name = "marks")
    private BigDecimal marks;
}