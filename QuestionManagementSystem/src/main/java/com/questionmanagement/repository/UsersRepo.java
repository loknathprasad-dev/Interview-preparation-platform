package com.questionmanagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.questionmanagement.entity.Users;

public interface UsersRepo extends JpaRepository<Users, Integer> {

    Optional<Users> findByEmail(String email);

}