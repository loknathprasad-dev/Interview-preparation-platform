package com.interfinix.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.interfinix.backend.entity.Domain;
import com.interfinix.backend.service.AssignmentService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    // admin: see a faculty's domains
    @GetMapping("/admin/faculty/{id}/domains")
    public List<Domain> getDomains(@PathVariable Integer id) {
        return assignmentService.getDomains(id);
    }

    // admin: assign domains, body looks like {"domainIds":[1,2]}
    @PutMapping("/admin/faculty/{id}/domains")
    public Map<String, String> setDomains(@PathVariable Integer id,
                                          @RequestBody Map<String, List<Integer>> body) {
        assignmentService.setDomains(id, body.get("domainIds"));
        return Map.of("status", "SUCCESS");
    }

    // faculty page: my domains
    @GetMapping("/faculty/domains")
    public List<Domain> myDomains(@RequestParam String email) {
        return assignmentService.getDomainsByEmail(email);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> badRequest(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> notFound(NoSuchElementException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
    }
}