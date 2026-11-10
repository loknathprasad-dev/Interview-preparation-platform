package com.interfinix.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.interfinix.backend.entity.FacultyDomain;
import com.interfinix.backend.entity.Question;
import com.interfinix.backend.entity.User;
import com.interfinix.backend.repository.FacultyDomainRepository;
import com.interfinix.backend.repository.QuestionRepository;
import com.interfinix.backend.repository.UserRepository;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final FacultyDomainRepository facultyDomainRepository;

    public QuestionService(QuestionRepository questionRepository,
                           UserRepository userRepository,
                           FacultyDomainRepository facultyDomainRepository) {
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.facultyDomainRepository = facultyDomainRepository;
    }

    // STUDENT: only ACTIVE questions of a domain
    public List<Question> getActiveByDomain(Integer domainId) {
        return questionRepository.findByDomainIdAndStatus(domainId, "ACTIVE");
    }

    // FACULTY: all questions (active and inactive) of my own domain
    public List<Question> getMine(String email) {
        User faculty = findFaculty(email);
        return questionRepository.findByDomainId(domainOf(faculty));
    }

    // FACULTY: add a question to my own domain
    public Question addQuestion(String email, Question input) {
        User faculty = findFaculty(email);
        Integer domainId = domainOf(faculty);

        Question q = new Question();
        q.setQuestionText(cleanText(input.getQuestionText()));
        q.setDomainId(domainId);
        q.setFacultyId(faculty.getUserId());
        q.setStatus("ACTIVE");
        q.setCreatedAt(LocalDateTime.now());
        q.setUpdatedAt(LocalDateTime.now());
        return questionRepository.save(q);
    }

    // FACULTY: edit text and/or status of a question in my own domain
    public Question updateQuestion(String email, Integer questionId, Question input) {
        User faculty = findFaculty(email);
        Question q = findOwned(questionId, domainOf(faculty));

        q.setQuestionText(cleanText(input.getQuestionText()));
        String status = cleanStatus(input.getStatus());
        if (status != null) {
            q.setStatus(status);
        }
        q.setUpdatedAt(LocalDateTime.now());
        return questionRepository.save(q);
    }

    // FACULTY: delete a question in my own domain
    public void deleteQuestion(String email, Integer questionId) {
        User faculty = findFaculty(email);
        Question q = findOwned(questionId, domainOf(faculty));
        questionRepository.delete(q);
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

    private Question findOwned(Integer questionId, Integer domainId) {
        Question q = questionRepository.findById(questionId)
                .orElseThrow(() -> new NoSuchElementException("Question not found."));
        if (!q.getDomainId().equals(domainId)) {
            throw new IllegalStateException("You can only manage questions of your own domain.");
        }
        return q;
    }

    private String cleanText(String text) {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Question text cannot be empty.");
        }
        return text.trim();
    }

    private String cleanStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            return null;
        }
        String s = status.trim().toUpperCase();
        if (!s.equals("ACTIVE") && !s.equals("INACTIVE")) {
            throw new IllegalArgumentException("Status must be ACTIVE or INACTIVE.");
        }
        return s;
    }
}