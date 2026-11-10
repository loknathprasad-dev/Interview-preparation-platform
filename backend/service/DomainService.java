package com.interfinix.backend.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.interfinix.backend.entity.Domain;
import com.interfinix.backend.repository.DomainRepository;
import com.interfinix.backend.repository.FacultyDomainRepository;
import com.interfinix.backend.repository.QuestionRepository;
import com.interfinix.backend.repository.StudentQueryRepository;
import com.interfinix.backend.repository.SubmissionRepository;

@Service
public class DomainService {

    private final DomainRepository domainRepository;
    private final FacultyDomainRepository facultyDomainRepository;
    private final QuestionRepository questionRepository;
    private final SubmissionRepository submissionRepository;
    private final StudentQueryRepository queryRepository;

    public DomainService(DomainRepository domainRepository,
                         FacultyDomainRepository facultyDomainRepository,
                         QuestionRepository questionRepository,
                         SubmissionRepository submissionRepository,
                         StudentQueryRepository queryRepository) {
        this.domainRepository = domainRepository;
        this.facultyDomainRepository = facultyDomainRepository;
        this.questionRepository = questionRepository;
        this.submissionRepository = submissionRepository;
        this.queryRepository = queryRepository;
    }

    public Domain addDomain(Domain domain) {
        String name = cleanName(domain.getDomainName());
        if (domainRepository.existsByDomainName(name)) {
            throw new IllegalArgumentException("A domain with this name already exists.");
        }
        domain.setId(null);
        domain.setDomainName(name);
        return domainRepository.save(domain);
    }

    public List<Domain> getAllDomains() {
        return domainRepository.findAll();
    }

    public Domain getDomainById(Integer id) {
        return domainRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Domain not found with id: " + id));
    }

    public Domain updateDomain(Integer id, Domain details) {
        Domain domain = getDomainById(id);
        String name = cleanName(details.getDomainName());
        if (domainRepository.existsByDomainNameAndIdNot(name, id)) {
            throw new IllegalArgumentException("Another domain already has this name.");
        }
        domain.setDomainName(name);
        domain.setDescription(details.getDescription());
        return domainRepository.save(domain);
    }

    public void deleteDomain(Integer id) {
        Domain domain = getDomainById(id);
        if (facultyDomainRepository.existsByDomainId(id)) {
            throw new IllegalArgumentException(
                    "This domain is assigned to a faculty member. Remove the assignment first.");
        }
        if (questionRepository.existsByDomainId(id)) {
            throw new IllegalArgumentException(
                    "This domain has questions. Delete its questions first.");
        }
        if (submissionRepository.existsByDomainId(id)) {
            throw new IllegalArgumentException(
                    "Students have already taken tests in this domain, so it cannot be deleted.");
        }
        if (queryRepository.existsByDomainId(id)) {
            throw new IllegalArgumentException(
                    "Students have asked queries in this domain, so it cannot be deleted.");
        }
        domainRepository.delete(domain);
    }

    private String cleanName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Domain name cannot be empty.");
        }
        return name.trim();
    }
}