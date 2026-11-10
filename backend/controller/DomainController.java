package com.interfinix.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.interfinix.backend.entity.Domain;
import com.interfinix.backend.service.DomainService;

@RestController
@RequestMapping("/api/domains")
@CrossOrigin(origins = "*")
public class DomainController {

    private final DomainService domainService;

    public DomainController(DomainService domainService) {
        this.domainService = domainService;
    }

    @PostMapping
    public Domain addDomain(@RequestBody Domain domain) {
        return domainService.addDomain(domain);
    }

    @GetMapping
    public List<Domain> getAllDomains() {
        return domainService.getAllDomains();
    }

    @GetMapping("/{id}")
    public Domain getDomainById(@PathVariable Integer id) {
        return domainService.getDomainById(id);
    }

    @PutMapping("/{id}")
    public Domain updateDomain(@PathVariable Integer id, @RequestBody Domain domain) {
        return domainService.updateDomain(id, domain);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteDomain(@PathVariable Integer id) {
        domainService.deleteDomain(id);
        return Map.of("status", "SUCCESS");
    }

    // clear error messages instead of a crash
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> badRequest(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> notFound(NoSuchElementException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
    }
}