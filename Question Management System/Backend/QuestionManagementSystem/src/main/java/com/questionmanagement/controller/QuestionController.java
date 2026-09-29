package com.questionmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.questionmanagement.entity.Question;
import com.questionmanagement.service.QuestionService;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin
public class QuestionController {
	
	@Autowired
	private QuestionService questionService;
	
	@PostMapping
	public Question addQuestion(@RequestBody Question question) {
		System.out.println("addquestion method called");
		return questionService.addQuestion(question);
	}
	
	@GetMapping
	public List<Question> getAllQuestions(){
		return questionService.getAllQuestions();
	}
	
	@GetMapping("/{questionId}")
	public Question getQuestionById(@PathVariable Integer questionId) {
		return questionService.getQuestionById(questionId);
	}
	
	@PutMapping("{questionId}")
	public Question updateQuestion(@PathVariable Integer questionId ,@RequestBody Question question) {
		return questionService.updateQuestion(questionId , question);		
	}
	
	@DeleteMapping("/{questionId}")
	public void deleteQuestion(@PathVariable Integer questionId) {
		questionService.deleteQuestion(questionId);
	}
	

}
