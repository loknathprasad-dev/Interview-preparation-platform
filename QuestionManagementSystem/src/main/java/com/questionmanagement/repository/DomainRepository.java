package com.questionmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.questionmanagement.entity.Domain;

public interface DomainRepository extends JpaRepository<Domain, Long> {

}