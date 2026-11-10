package com.interfinix.backend.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.interfinix.backend.entity.Domain;
import com.interfinix.backend.entity.FacultyDomain;
import com.interfinix.backend.entity.User;
import com.interfinix.backend.repository.DomainRepository;
import com.interfinix.backend.repository.FacultyDomainRepository;
import com.interfinix.backend.repository.UserRepository;

@Service
public class AssignmentService {

    private final FacultyDomainRepository facultyDomainRepository;
    private final UserRepository userRepository;
    private final DomainRepository domainRepository;

    public AssignmentService(FacultyDomainRepository facultyDomainRepository,
                             UserRepository userRepository,
                             DomainRepository domainRepository) {
        this.facultyDomainRepository = facultyDomainRepository;
        this.userRepository = userRepository;
        this.domainRepository = domainRepository;
    }

    // ADMIN: set the faculty's domain (at most one)
    @Transactional
    public void setDomains(Integer facultyId, List<Integer> domainIds) {
        User user = userRepository.findById(facultyId)
                .orElseThrow(() -> new NoSuchElementException("Faculty not found."));
        if (!"FACULTY".equals(user.getRole())) {
            throw new NoSuchElementException("Faculty not found.");
        }

        Set<Integer> ids = new LinkedHashSet<>();
        if (domainIds != null) {
            ids.addAll(domainIds);
        }
        if (ids.size() > 1) {
            throw new IllegalArgumentException("A faculty member can have only one domain.");
        }
        for (Integer id : ids) {
            if (!domainRepository.existsById(id)) {
                throw new IllegalArgumentException("Domain not found with id: " + id);
            }
        }

        facultyDomainRepository.deleteByFacultyId(facultyId);
        for (Integer id : ids) {
            FacultyDomain fd = new FacultyDomain();
            fd.setFacultyId(facultyId);
            fd.setDomainId(id);
            facultyDomainRepository.save(fd);
        }
    }

    // domains assigned to one faculty (by user id)
    public List<Domain> getDomains(Integer facultyId) {
        List<Integer> ids = facultyDomainRepository.findByFacultyId(facultyId).stream()
                .map(FacultyDomain::getDomainId)
                .toList();
        return domainRepository.findAllById(ids);
    }

    // domains assigned to one faculty (by email, used by the faculty page)
    public List<Domain> getDomainsByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Faculty not found."));
        if (!"FACULTY".equals(user.getRole())) {
            throw new NoSuchElementException("Faculty not found.");
        }
        return getDomains(user.getUserId());
    }
}