package com.interfinix.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.interfinix.backend.entity.Submission;

public interface SubmissionRepository extends JpaRepository<Submission, Integer> {

    List<Submission> findByStudentIdOrderBySubmittedAtDesc(Integer studentId);

    List<Submission> findByDomainIdOrderBySubmittedAtDesc(Integer domainId);

    boolean existsByDomainId(Integer domainId);
}