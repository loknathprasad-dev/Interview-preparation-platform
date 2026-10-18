package com.questionmanagement.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "questions")
public class Question {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "question_id")
	private Integer questionId;
	
	@Column(name = "domain_id")
	private Integer domainId;
	
	@Column(name = "faculty_id")
	private Integer facultyId;
	
	@Column(name = "question_text")
	private String questionText;
	
	@Column(name = "difficulty_level")
	private String difficultyLevel;
	
	@Column(name = "question_type")
	private String questionType;
	
	@Column(name = "status")
	private String status;
	
	@Column(name = "created_at")
	private LocalDateTime createdAt;
	
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;
	
}
