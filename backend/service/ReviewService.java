package com.interfinix.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.interfinix.backend.entity.FacultyDomain;
import com.interfinix.backend.entity.Submission;
import com.interfinix.backend.entity.SubmissionAnswer;
import com.interfinix.backend.entity.User;
import com.interfinix.backend.repository.FacultyDomainRepository;
import com.interfinix.backend.repository.SubmissionAnswerRepository;
import com.interfinix.backend.repository.SubmissionRepository;
import com.interfinix.backend.repository.UserRepository;
import com.interfinix.backend.request.MarksRequest;

@Service
public class ReviewService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionAnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final FacultyDomainRepository facultyDomainRepository;

    public ReviewService(SubmissionRepository submissionRepository,
                         SubmissionAnswerRepository answerRepository,
                         UserRepository userRepository,
                         FacultyDomainRepository facultyDomainRepository) {
        this.submissionRepository = submissionRepository;
        this.answerRepository = answerRepository;
        this.userRepository = userRepository;
        this.facultyDomainRepository = facultyDomainRepository;
    }

    // FACULTY: list of tests taken in my own domain
    public List<Map<String, Object>> listForFaculty(String email) {
        Integer domainId = domainOf(findFaculty(email));
        List<Map<String, Object>> out = new ArrayList<>();
        for (Submission s : submissionRepository.findByDomainIdOrderBySubmittedAtDesc(domainId)) {
            Map<String, Object> row = new HashMap<>();
            row.put("submissionId", s.getSubmissionId());
            row.put("studentName", studentName(s.getStudentId()));
            row.put("status", s.getStatus());
            row.put("totalMarks", s.getTotalMarks());
            row.put("submittedAt", s.getSubmittedAt() == null ? "" : s.getSubmittedAt().toString());
            out.add(row);
        }
        return out;
    }

    // FACULTY: one test with all its answers
    public Map<String, Object> detailForFaculty(String email, Integer submissionId) {
        Submission s = findOwned(email, submissionId);
        List<Map<String, Object>> answers = new ArrayList<>();
        for (SubmissionAnswer a : answerRepository.findBySubmissionId(submissionId)) {
            Map<String, Object> row = new HashMap<>();
            row.put("answerId", a.getAnswerId());
            row.put("questionText", a.getQuestionText());
            row.put("answerText", a.getAnswerText());
            row.put("marks", a.getMarks());
            answers.add(row);
        }
        Map<String, Object> out = new HashMap<>();
        out.put("submissionId", s.getSubmissionId());
        out.put("studentName", studentName(s.getStudentId()));
        out.put("status", s.getStatus());
        out.put("totalMarks", s.getTotalMarks());
        out.put("answers", answers);
        return out;
    }

    // FACULTY: save marks for every answer, then total them
    @Transactional
    public void saveMarks(String email, Integer submissionId, MarksRequest req) {
        Submission s = findOwned(email, submissionId);
        if (req == null || req.getMarks() == null || req.getMarks().isEmpty()) {
            throw new IllegalArgumentException("No marks were sent.");
        }

        Map<Integer, SubmissionAnswer> mine = new HashMap<>();
        for (SubmissionAnswer a : answerRepository.findBySubmissionId(submissionId)) {
            mine.put(a.getAnswerId(), a);
        }

        for (MarksRequest.Item item : req.getMarks()) {
            SubmissionAnswer a = item.getAnswerId() == null ? null : mine.get(item.getAnswerId());
            if (a == null) {
                throw new IllegalArgumentException("An answer does not belong to this test.");
            }
            BigDecimal m = item.getMarks();
            if (m == null || m.signum() < 0 || m.compareTo(new BigDecimal("100")) > 0) {
                throw new IllegalArgumentException("Marks must be between 0 and 100.");
            }
            a.setMarks(m);
            answerRepository.save(a);
        }

        BigDecimal total = BigDecimal.ZERO;
        for (SubmissionAnswer a : answerRepository.findBySubmissionId(submissionId)) {
            if (a.getMarks() != null) {
                total = total.add(a.getMarks());
            }
        }
        s.setTotalMarks(total);
        s.setStatus("CHECKED");
        s.setCheckedAt(LocalDateTime.now());
        submissionRepository.save(s);
    }

    // ---------- helpers ----------

    private User findFaculty(String email) {
        User user = userRepository.findByEmail(email == null ? "" : email.trim())
                .orElseThrow(() -> new NoSuchElementException("Faculty not found."));
        if (!"FACULTY".equals(user.getRole())) {
            throw new NoSuchElementException("Faculty not found.");
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

    private Submission findOwned(String email, Integer submissionId) {
        Integer domainId = domainOf(findFaculty(email));
        Submission s = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new NoSuchElementException("Test not found."));
        if (!s.getDomainId().equals(domainId)) {
            throw new IllegalStateException("You can only check tests of your own domain.");
        }
        return s;
    }

    private String studentName(Integer studentId) {
        return userRepository.findById(studentId).map(User::getName).orElse("Unknown student");
    }
}