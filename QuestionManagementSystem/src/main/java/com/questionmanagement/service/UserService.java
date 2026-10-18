package com.questionmanagement.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.questionmanagement.entity.Users;
import com.questionmanagement.repository.UsersRepo;
import com.questionmanagement.request.LoginRequest;

@Service
public class UserService {

    private final UsersRepo usersRepo;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserService(UsersRepo usersRepo) {
        this.usersRepo = usersRepo;
    }

    // Register User
    public Users addUser(Users user) {

        if (usersRepo.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        user.setUserId(null);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setStatus("ACTIVE");

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return usersRepo.save(user);
    }

    // Login User
    public Map<String, Object> loginUser(LoginRequest loginRequest) {

        Optional<Users> user =
                usersRepo.findByEmail(loginRequest.getEmail());

        if (user.isEmpty()) {
            return null;
        }

        Users existingUser = user.get();

        if (!"ACTIVE".equalsIgnoreCase(existingUser.getStatus())) {
            return null;
        }

        boolean passwordMatched = passwordEncoder.matches(
                loginRequest.getPassword(),
                existingUser.getPassword()
        );

        if (!passwordMatched) {
            return null;
        }

        // Login successful - Return user details
        Map<String, Object> result = new HashMap<>();

        result.put("userId", existingUser.getUserId());
        result.put("name", existingUser.getName());
        result.put("email", existingUser.getEmail());
        result.put("role", existingUser.getRole());

        return result;
    }
}