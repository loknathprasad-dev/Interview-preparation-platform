package com.interfinix.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.interfinix.backend.entity.SubmissionAnswer;

public interface SubmissionAnswerRepository extends JpaRepository<SubmissionAnswer, Integer> {

    List<SubmissionAnswer> findBySubmissionId(Integer submissionId);
}