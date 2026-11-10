package com.interfinix.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.interfinix.backend.entity.Domain;

public interface DomainRepository extends JpaRepository<Domain, Integer> {

    boolean existsByDomainName(String domainName);

    boolean existsByDomainNameAndIdNot(String domainName, Integer id);
}