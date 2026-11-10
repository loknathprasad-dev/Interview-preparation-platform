package com.interfinix.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.interfinix.backend.entity.StudentQuery;

public interface StudentQueryRepository extends JpaRepository<StudentQuery, Integer> {

    List<StudentQuery> findByStudentIdOrderByCreatedAtDesc(Integer studentId);

    List<StudentQuery> findByDomainIdOrderByCreatedAtDesc(Integer domainId);

    boolean existsByDomainId(Integer domainId);
}