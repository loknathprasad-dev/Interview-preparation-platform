package com.questionmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.questionmanagement.entity.Faculty;

public interface FacultyRepository extends JpaRepository<Faculty, Integer> {

}