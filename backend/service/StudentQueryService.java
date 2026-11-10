package com.interfinix.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.interfinix.backend.entity.Domain;
import com.interfinix.backend.entity.FacultyDomain;
import com.interfinix.backend.entity.StudentQuery;
import com.interfinix.backend.entity.User;
import com.interfinix.backend.repository.DomainRepository;
import com.interfinix.backend.repository.FacultyDomainRepository;
import com.interfinix.backend.repository.StudentQueryRepository;
import com.interfinix.backend.repository.UserRepository;

@Service
public class StudentQueryService {

    private final StudentQueryRepository queryRepository;
    private final UserRepository userRepository;
    private final DomainRepository domainRepository;
    private final FacultyDomainRepository facultyDomainRepository;

    public StudentQueryService(StudentQueryRepository queryRepository,
                               UserRepository userRepository,
                               DomainRepository domainRepository,
                               FacultyDomainRepository facultyDomainRepository) {
        this.queryRepository = queryRepository;
        this.userRepository = userRepository;
        this.domainRepository = domainRepository;
        this.facultyDomainRepository = facultyDomainRepository;
    }

    // STUDENT: ask a doubt in a domain
    public StudentQuery ask(String email, Integer domainId, String text) {
        User student = findUser(email, "STUDENT");
        if (domainId == null || !domainRepository.existsById(domainId)) {
            throw new NoSuchElementException("Domain not found.");
        }
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Please write your doubt.");
        }
        StudentQuery q = new StudentQuery();
        q.setStudentId(student.getUserId());
        q.setDomainId(domainId);
        q.setQueryText(text.trim());
        q.setStatus("OPEN");
        q.setCreatedAt(LocalDateTime.now());
        return queryRepository.save(q);
    }

    // STUDENT: my queries with replies
    public List<Map<String, Object>> listMine(String email) {
        User student = findUser(email, "STUDENT");
        List<Map<String, Object>> out = new ArrayList<>();
        for (StudentQuery q : queryRepository.findByStudentIdOrderByCreatedAtDesc(student.getUserId())) {
            Map<String, Object> row = new HashMap<>();
            row.put("queryId", q.getQueryId());
            row.put("domainName", domainName(q.getDomainId()));
            row.put("queryText", q.getQueryText());
            row.put("replyText", q.getReplyText());
            row.put("status", q.getStatus());
            row.put("createdAt", q.getCreatedAt() == null ? "" : q.getCreatedAt().toString());
            out.add(row);
        }
        return out;
    }

    // FACULTY: queries of my own domain
    public List<Map<String, Object>> listForFaculty(String email) {
        Integer domainId = domainOf(findUser(email, "FACULTY"));
        List<Map<String, Object>> out = new ArrayList<>();
        for (StudentQuery q : queryRepository.findByDomainIdOrderByCreatedAtDesc(domainId)) {
            Map<String, Object> row = new HashMap<>();
            row.put("queryId", q.getQueryId());
            row.put("studentName", userRepository.findById(q.getStudentId())
                    .map(User::getName).orElse("Unknown student"));
            row.put("queryText", q.getQueryText());
            row.put("replyText", q.getReplyText());
            row.put("status", q.getStatus());
            row.put("createdAt", q.getCreatedAt() == null ? "" : q.getCreatedAt().toString());
            out.add(row);
        }
        return out;
    }

    // FACULTY: reply to a query of my own domain
    public void reply(String email, Integer queryId, String replyText) {
        User faculty = findUser(email, "FACULTY");
        Integer domainId = domainOf(faculty);
        StudentQuery q = queryRepository.findById(queryId)
                .orElseThrow(() -> new NoSuchElementException("Query not found."));
        if (!q.getDomainId().equals(domainId)) {
            throw new IllegalStateException("You can only reply to queries of your own domain.");
        }
        if (replyText == null || replyText.trim().isEmpty()) {
            throw new IllegalArgumentException("Reply cannot be empty.");
        }
        q.setReplyText(replyText.trim());
        q.setRepliedBy(faculty.getUserId());
        q.setRepliedAt(LocalDateTime.now());
        q.setStatus("ANSWERED");
        queryRepository.save(q);
    }

    // ---------- helpers ----------

    private User findUser(String email, String role) {
        User user = userRepository.findByEmail(email == null ? "" : email.trim())
                .orElseThrow(() -> new NoSuchElementException("User not found."));
        if (!role.equals(user.getRole())) {
            throw new NoSuchElementException("User not found.");
        }
        return user;
    }

    private Integer domainOf(User faculty) {
        List<FacultyDomain> list = facultyDomainRepository.findByFacultyId(faculty.getUserId());
        if (list.isEmpty()) {
            throw new IllegalArgumentException("No domain has been assigned to you yet.");
        }
        return list.get(0).getDomainId();
    }

    private String domainName(Integer domainId) {
        return domainRepository.findById(domainId).map(Domain::getDomainName).orElse("Unknown domain");
    }
}