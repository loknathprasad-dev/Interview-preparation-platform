package com.interfinix.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.interfinix.backend.entity.Domain;
import com.interfinix.backend.entity.Submission;
import com.interfinix.backend.entity.SubmissionAnswer;
import com.interfinix.backend.entity.User;
import com.interfinix.backend.repository.DomainRepository;
import com.interfinix.backend.repository.SubmissionAnswerRepository;
import com.interfinix.backend.repository.SubmissionRepository;
import com.interfinix.backend.repository.UserRepository;

@Service
public class ResultService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionAnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final DomainRepository domainRepository;

    public ResultService(SubmissionRepository submissionRepository,
                         SubmissionAnswerRepository answerRepository,
                         UserRepository userRepository,
                         DomainRepository domainRepository) {
        this.submissionRepository = submissionRepository;
        this.answerRepository = answerRepository;
        this.userRepository = userRepository;
        this.domainRepository = domainRepository;
    }

    // STUDENT: all my tests
    public List<Map<String, Object>> listMine(String email) {
        User student = findStudent(email);
        List<Map<String, Object>> out = new ArrayList<>();
        for (Submission s : submissionRepository.findByStudentIdOrderBySubmittedAtDesc(student.getUserId())) {
            Map<String, Object> row = new HashMap<>();
            row.put("submissionId", s.getSubmissionId());
            row.put("domainName", domainName(s.getDomainId()));
            row.put("status", s.getStatus());
            row.put("totalMarks", s.getTotalMarks());
            row.put("submittedAt", s.getSubmittedAt() == null ? "" : s.getSubmittedAt().toString());
            out.add(row);
        }
        return out;
    }

    // STUDENT: one of my tests with answers (marks only once checked)
    public Map<String, Object> detailMine(String email, Integer submissionId) {
        User student = findStudent(email);
        Submission s = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new NoSuchElementException("Test not found."));
        if (!s.getStudentId().equals(student.getUserId())) {
            throw new IllegalStateException("You can only view your own tests.");
        }
        boolean checked = "CHECKED".equals(s.getStatus());

        List<Map<String, Object>> answers = new ArrayList<>();
        for (SubmissionAnswer a : answerRepository.findBySubmissionId(submissionId)) {
            Map<String, Object> row = new HashMap<>();
            row.put("questionText", a.getQuestionText());
            row.put("answerText", a.getAnswerText());
            row.put("marks", checked ? a.getMarks() : null);
            answers.add(row);
        }
        Map<String, Object> out = new HashMap<>();
        out.put("domainName", domainName(s.getDomainId()));
        out.put("status", s.getStatus());
        out.put("totalMarks", checked ? s.getTotalMarks() : null);
        out.put("answers", answers);
        return out;
    }

    private User findStudent(String email) {
        User user = userRepository.findByEmail(email == null ? "" : email.trim())
                .orElseThrow(() -> new NoSuchElementException("Student not found."));
        if (!"STUDENT".equals(user.getRole())) {
            throw new NoSuchElementException("Student not found.");
        }
        return user;
    }

    private String domainName(Integer domainId) {
        return domainRepository.findById(domainId).map(Domain::getDomainName).orElse("Unknown domain");
    }
}