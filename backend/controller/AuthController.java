package com.interfinix.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.interfinix.backend.entity.User;
import com.interfinix.backend.request.LoginRequest;
import com.interfinix.backend.service.UserService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public Map<String, String> signup(@RequestBody User user) {
        return Map.of("status", userService.signupStudent(user));
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest req) {
        String result = userService.login(req.getEmail(), req.getPassword(), req.getRole());
        String name = "SUCCESS".equals(result)
                ? userService.getDisplayName(req.getEmail(), req.getRole()) : "";
        return Map.of("status", result, "role", req.getRole(), "name", name);
    }

    @PostMapping("/admin/faculty")
    public Map<String, String> addFaculty(@RequestBody User user) {
        return Map.of("status", userService.addFaculty(user));
    }

    @GetMapping("/admin/faculty")
    public List<Map<String, Object>> listFaculty() {
        return userService.listFaculty();
    }

    @PutMapping("/admin/faculty/{id}")
    public Map<String, String> updateFaculty(@PathVariable Integer id, @RequestBody User user) {
        return Map.of("status", userService.updateFaculty(id, user));
    }

    @DeleteMapping("/admin/faculty/{id}")
    public Map<String, String> deleteFaculty(@PathVariable Integer id) {
        return Map.of("status", userService.deleteFaculty(id));
    }
}