package com.questionmanagement.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.questionmanagement.entity.Domain;
import com.questionmanagement.repository.DomainRepository;

@Service
public class DomainService {

    private final DomainRepository domainRepository;

    public DomainService(DomainRepository domainRepository) {
        this.domainRepository = domainRepository;
    }

    // 1. Add Domain
    public Domain addDomain(Domain domain) {

        domain.setId(null);
        domain.setStatus("ACTIVE");
        domain.setCreatedAt(LocalDateTime.now());
        domain.setUpdatedAt(LocalDateTime.now());

        return domainRepository.save(domain);
    }

    // 2. View All Domains
    public List<Domain> getAllDomains() {

        return domainRepository.findAll();
    }

    // 3. View Domain By ID
    public Domain getDomainById(Long id) {

        return domainRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Domain not found with id: " + id)
                );
    }

    // 4. Update Domain
    public Domain updateDomain(Long id, Domain domainDetails) {

        Domain domain = getDomainById(id);

        domain.setDomainName(domainDetails.getDomainName());
        domain.setDescription(domainDetails.getDescription());
        domain.setUpdatedAt(LocalDateTime.now());

        return domainRepository.save(domain);
    }

    // 5. Delete Domain
    public void deleteDomain(Long id) {

        Domain domain = getDomainById(id);

        domainRepository.delete(domain);
    }
}