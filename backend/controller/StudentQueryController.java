package com.interfinix.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.interfinix.backend.request.QueryRequest;
import com.interfinix.backend.service.StudentQueryService;

@RestController
@RequestMapping("/api/queries")
@CrossOrigin(origins = "*")
public class StudentQueryController {

    private final StudentQueryService queryService;

    public StudentQueryController(StudentQueryService queryService) {
        this.queryService = queryService;
    }

    // student: ask a doubt, body {"domainId":1,"queryText":"..."}
    @PostMapping
    public Map<String, String> ask(@RequestParam String email, @RequestBody QueryRequest req) {
        queryService.ask(email, req.getDomainId(), req.getQueryText());
        return Map.of("status", "SUCCESS");
    }

    // student: my queries
    @GetMapping("/mine")
    public List<Map<String, Object>> mine(@RequestParam String email) {
        return queryService.listMine(email);
    }

    // faculty: queries of my domain
    @GetMapping("/faculty")
    public List<Map<String, Object>> forFaculty(@RequestParam String email) {
        return queryService.listForFaculty(email);
    }

    // faculty: reply, body {"replyText":"..."}
    @PutMapping("/{queryId}/reply")
    public Map<String, String> reply(@PathVariable Integer queryId,
                                     @RequestParam String email,
                                     @RequestBody QueryRequest req) {
        queryService.reply(email, queryId, req.getReplyText());
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