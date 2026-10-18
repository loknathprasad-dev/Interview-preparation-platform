package com.questionmanagement.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.questionmanagement.entity.Users;
import com.questionmanagement.request.LoginRequest;
import com.questionmanagement.service.UserService;

@RestController
@CrossOrigin(origins = "*")
public class UsersController {

    private final UserService userService;

    public UsersController(UserService userService) {
        this.userService = userService;
    }

    // Register User
    @PostMapping("/addUser")
    public ResponseEntity<?> addUser(@RequestBody Users user) {

        try {

            user.setRole("STUDENT");

            Users savedUser = userService.addUser(user);

            savedUser.setPassword(null);

            return ResponseEntity.ok(savedUser);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

    // Login User
    @PostMapping("/loginUser")
    public ResponseEntity<?> loginUser(
            @RequestBody LoginRequest loginRequest) {

        Map<String, Object> result = userService.loginUser(loginRequest);

        if (result == null) {
            return ResponseEntity.status(401)
                    .body("Invalid email or password");
        }

        return ResponseEntity.ok(result);
    }
}