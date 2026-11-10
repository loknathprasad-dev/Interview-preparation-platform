package com.interfinix.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.interfinix.backend.entity.Question;
import com.interfinix.backend.service.QuestionService;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // student page: active questions of a domain
    @GetMapping("/domain/{domainId}")
    public List<Question> getByDomain(@PathVariable Integer domainId) {
        return questionService.getActiveByDomain(domainId);
    }

    // faculty page: all questions of my domain
    @GetMapping("/mine")
    public List<Question> mine(@RequestParam String email) {
        return questionService.getMine(email);
    }

    @PostMapping
    public Question add(@RequestParam String email, @RequestBody Question question) {
        return questionService.addQuestion(email, question);
    }

    @PutMapping("/{questionId}")
    public Question update(@PathVariable Integer questionId,
                           @RequestParam String email,
                           @RequestBody Question question) {
        return questionService.updateQuestion(email, questionId, question);
    }

    @DeleteMapping("/{questionId}")
    public Map<String, String> delete(@PathVariable Integer questionId,
                                      @RequestParam String email) {
        questionService.deleteQuestion(email, questionId);
        return Map.of("status", "SUCCESS");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> badRequest(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> notFound(NoSuchElementException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> forbidden(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
    }
}