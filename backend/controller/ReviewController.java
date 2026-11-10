package com.interfinix.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.interfinix.backend.request.MarksRequest;
import com.interfinix.backend.service.ReviewService;

@RestController
@RequestMapping("/api/review")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // faculty: tests of my domain
    @GetMapping
    public List<Map<String, Object>> list(@RequestParam String email) {
        return reviewService.listForFaculty(email);
    }

    // faculty: one test with answers
    @GetMapping("/{submissionId}")
    public Map<String, Object> detail(@PathVariable Integer submissionId,
                                      @RequestParam String email) {
        return reviewService.detailForFaculty(email, submissionId);
    }

    // faculty: save marks, body {"marks":[{"answerId":1,"marks":7}]}
    @PutMapping("/{submissionId}/marks")
    public Map<String, String> saveMarks(@PathVariable Integer submissionId,
                                         @RequestParam String email,
                                         @RequestBody MarksRequest req) {
        reviewService.saveMarks(email, submissionId, req);
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