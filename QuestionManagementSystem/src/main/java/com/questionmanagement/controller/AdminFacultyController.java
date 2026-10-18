package com.questionmanagement.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.questionmanagement.entity.Faculty;
import com.questionmanagement.entity.Users;
import com.questionmanagement.repository.FacultyRepository;
import com.questionmanagement.service.UserService;

@RestController
@CrossOrigin(origins = "*")
public class AdminFacultyController {

    private final UserService userService;
    private final FacultyRepository facultyRepository;

    public AdminFacultyController(
            UserService userService,
            FacultyRepository facultyRepository) {

        this.userService = userService;
        this.facultyRepository = facultyRepository;
    }

    @PostMapping("/api/admin/faculty/create")
    @Transactional
    public ResponseEntity<?> createFaculty(
            @RequestBody Map<String, Object> data) {

        String name = (String) data.get("facultyName");
        String email = (String) data.get("email");
        String password = (String) data.get("password");
        String employeeId = (String) data.get("employeeId");

        if (name == null || name.isBlank()
                || email == null || email.isBlank()
                || password == null || password.isBlank()
                || employeeId == null || employeeId.isBlank()
                || data.get("domainId") == null) {

            return ResponseEntity.badRequest()
                    .body("All fields are required");
        }

        if (password.length() < 8) {
            return ResponseEntity.badRequest()
                    .body("Password must contain at least 8 characters");
        }

        Integer domainId =
                ((Number) data.get("domainId")).intValue();

        // Step 1: Create Faculty Login Account
        Users user = new Users();

        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole("FACULTY");

        Users savedUser;

        try {
            savedUser = userService.addUser(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        // Step 2: Save Faculty Details
        Faculty faculty = new Faculty();

        faculty.setUserId(savedUser.getUserId());
        faculty.setFacultyName(name);
        faculty.setEmail(email);
        faculty.setEmployeeId(employeeId);
        faculty.setDomainId(domainId);
        faculty.setCreatedBy(1);
        faculty.setStatus("ACTIVE");
        faculty.setCreatedAt(java.time.LocalDateTime.now());

        Faculty savedFaculty = facultyRepository.save(faculty);

        return ResponseEntity.ok(savedFaculty);
    }
}