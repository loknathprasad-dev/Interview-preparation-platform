package com.questionmanagement.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.questionmanagement.entity.Domain;
import com.questionmanagement.service.DomainService;

@RestController
@RequestMapping("/api/domains")
@CrossOrigin(origins = "*")
public class DomainController {

    private final DomainService domainService;

    public DomainController(DomainService domainService) {
        this.domainService = domainService;
    }

    // 1. Add Domain
    @PostMapping
    public Domain addDomain(@RequestBody Domain domain) {

        return domainService.addDomain(domain);
    }

    // 2. View All Domains
    @GetMapping
    public List<Domain> getAllDomains() {

        return domainService.getAllDomains();
    }

    // 3. View Domain By ID
    @GetMapping("/{id}")
    public Domain getDomainById(@PathVariable Long id) {

        return domainService.getDomainById(id);
    }

    // 4. Update Domain
    @PutMapping("/{id}")
    public Domain updateDomain(
            @PathVariable Long id,
            @RequestBody Domain domain) {

        return domainService.updateDomain(id, domain);
    }

    // 5. Delete Domain
    @DeleteMapping("/{id}")
    public void deleteDomain(@PathVariable Long id) {

        domainService.deleteDomain(id);
    }
}