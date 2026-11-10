package com.interfinix.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.interfinix.backend.entity.Question;

public interface QuestionRepository extends JpaRepository<Question, Integer> {

    List<Question> findByDomainId(Integer domainId);

    List<Question> findByDomainIdAndStatus(Integer domainId, String status);

    boolean existsByDomainId(Integer domainId);
}