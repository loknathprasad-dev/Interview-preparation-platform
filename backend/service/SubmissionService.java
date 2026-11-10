package com.interfinix.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.interfinix.backend.entity.Question;
import com.interfinix.backend.entity.Submission;
import com.interfinix.backend.entity.SubmissionAnswer;
import com.interfinix.backend.entity.User;
import com.interfinix.backend.repository.DomainRepository;
import com.interfinix.backend.repository.QuestionRepository;
import com.interfinix.backend.repository.SubmissionAnswerRepository;
import com.interfinix.backend.repository.SubmissionRepository;
import com.interfinix.backend.repository.UserRepository;
import com.interfinix.backend.request.SubmitRequest;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionAnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final DomainRepository domainRepository;

    public SubmissionService(SubmissionRepository submissionRepository,
                             SubmissionAnswerRepository answerRepository,
                             QuestionRepository questionRepository,
                             UserRepository userRepository,
                             DomainRepository domainRepository) {
        this.submissionRepository = submissionRepository;
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.domainRepository = domainRepository;
    }

    // STUDENT: submit a finished test
    @Transactional
    public Integer submitTest(String email, SubmitRequest req) {
        User student = userRepository.findByEmail(email == null ? "" : email.trim())
                .orElseThrow(() -> new NoSuchElementException("Student not found."));
        if (!"STUDENT".equals(student.getRole())) {
            throw new NoSuchElementException("Student not found.");
        }

        if (req == null || req.getDomainId() == null) {
            throw new IllegalArgumentException("Domain is required.");
        }
        if (!domainRepository.existsById(req.getDomainId())) {
            throw new NoSuchElementException("Domain not found.");
        }
        if (req.getAnswers() == null || req.getAnswers().isEmpty()) {
            throw new IllegalArgumentException("No answers were submitted.");
        }

        // only ACTIVE questions of this domain are accepted
        Map<Integer, Question> active = new HashMap<>();
        for (Question q : questionRepository.findByDomainIdAndStatus(req.getDomainId(), "ACTIVE")) {
            active.put(q.getQuestionId(), q);
        }

        List<SubmissionAnswer> toSave = new ArrayList<>();
        boolean anyAnswered = false;
        for (SubmitRequest.Item item : req.getAnswers()) {
            Question q = item.getQuestionId() == null ? null : active.get(item.getQuestionId());
            if (q == null) {
                continue;
            }
            String text = item.getAnswerText() == null ? "" : item.getAnswerText().trim();
            if (!text.isEmpty()) {
                anyAnswered = true;
            }
            SubmissionAnswer a = new SubmissionAnswer();
            a.setQuestionId(q.getQuestionId());
            a.setQuestionText(q.getQuestionText());
            a.setAnswerText(text);
            toSave.add(a);
        }
        if (toSave.isEmpty() || !anyAnswered) {
            throw new IllegalArgumentException("Please answer at least one question.");
        }

        Submission s = new Submission();
        s.setStudentId(student.getUserId());
        s.setDomainId(req.getDomainId());
        s.setStatus("SUBMITTED");
        s.setSubmittedAt(LocalDateTime.now());
        s = submissionRepository.save(s);

        for (SubmissionAnswer a : toSave) {
            a.setSubmissionId(s.getSubmissionId());
            answerRepository.save(a);
        }
        return s.getSubmissionId();
    }
}