package com.questionmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.questionmanagement.entity.Question;

public interface QuestionRepository extends JpaRepository<Question,Integer>{
List<Question> findByDomainId(Integer domainId);
}
