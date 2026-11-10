package com.interfinix.backend.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.interfinix.backend.entity.User;
import com.interfinix.backend.repository.FacultyDomainRepository;
import com.interfinix.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final FacultyDomainRepository facultyDomainRepository;

    public UserService(UserRepository userRepository,
                       FacultyDomainRepository facultyDomainRepository) {
        this.userRepository = userRepository;
        this.facultyDomainRepository = facultyDomainRepository;
    }

    // STUDENT SIGNUP
    public String signupStudent(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return "EMAIL_EXISTS";
        }
        user.setRole("STUDENT");
        user.setStatus("ACTIVE");
        userRepository.save(user);
        return "SUCCESS";
    }

    // LOGIN (student, faculty, admin)
    public String login(String email, String password, String role) {

        if ("ADMIN".equals(role)) {
            if ("Admin".equals(email) && "admin@interfinix123".equals(password)) {
                return "SUCCESS";
            }
            return "INVALID";
        }

        Optional<User> found = userRepository.findByEmail(email);
        if (found.isEmpty()) {
            return "INVALID";
        }

        User user = found.get();

        if (!user.getPassword().equals(password)) {
            return "INVALID";
        }
        if (!user.getRole().equals(role)) {
            return "INVALID";
        }
        if (!"ACTIVE".equals(user.getStatus())) {
            return "BLOCKED";
        }
        return "SUCCESS";
    }

    // name shown on the welcome line
    public String getDisplayName(String email, String role) {
        if ("ADMIN".equals(role)) {
            return "Admin";
        }
        return userRepository.findByEmail(email).map(User::getName).orElse(email);
    }

    // ADMIN: add a faculty member
    public String addFaculty(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return "EMAIL_EXISTS";
        }
        user.setRole("FACULTY");
        user.setStatus("ACTIVE");
        userRepository.save(user);
        return "SUCCESS";
    }

    // ADMIN: list all faculty (admin can see the password he set)
    public List<Map<String, Object>> listFaculty() {
        return userRepository.findByRole("FACULTY").stream()
                .map(u -> Map.<String, Object>of(
                        "userId", u.getUserId(),
                        "name", u.getName(),
                        "email", u.getEmail(),
                        "password", u.getPassword(),
                        "status", u.getStatus()))
                .toList();
    }

    // ADMIN: edit name, email and password of a faculty member
    public String updateFaculty(Integer userId, User input) {
        Optional<User> found = userRepository.findById(userId);
        if (found.isEmpty() || !"FACULTY".equals(found.get().getRole())) {
            return "NOT_FOUND";
        }
        User user = found.get();

        String name = input.getName() == null ? "" : input.getName().trim();
        String email = input.getEmail() == null ? "" : input.getEmail().trim();
        String password = input.getPassword() == null ? "" : input.getPassword();
        if (name.isEmpty() || email.isEmpty() || password.length() < 6) {
            return "INVALID";
        }

        if (!email.equals(user.getEmail()) && userRepository.existsByEmail(email)) {
            return "EMAIL_EXISTS";
        }

        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        userRepository.save(user);
        return "SUCCESS";
    }

    // ADMIN: delete a faculty member (and their domain assignments)
    @Transactional
    public String deleteFaculty(Integer userId) {
        Optional<User> found = userRepository.findById(userId);
        if (found.isEmpty() || !"FACULTY".equals(found.get().getRole())) {
            return "NOT_FOUND";
        }
        facultyDomainRepository.deleteByFacultyId(userId);
        userRepository.deleteById(userId);
        return "SUCCESS";
    }
}