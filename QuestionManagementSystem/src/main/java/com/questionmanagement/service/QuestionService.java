package com.questionmanagement.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.questionmanagement.entity.Question;
import com.questionmanagement.repository.QuestionRepository;

@Service
public class QuestionService {
	@Autowired
	private QuestionRepository questionRepository;

	public Question addQuestion(Question question) {
		// TODO Auto-generated method stub
		System.out.println("addquestion service method called");
		question.setStatus("ACTIVE");
		question.setCreatedAt(LocalDateTime.now());
		question.setUpdatedAt(LocalDateTime.now());
		return questionRepository.save(question);
	}
	
	public List <Question> getAllQuestions(){
		return questionRepository.findAll();
	}
	
	public Question getQuestionById(Integer questionId) {
		return questionRepository.findById(questionId).orElse(null);
	}
	
	public Question updateQuestion(Integer questionId,Question question) {
		question.setQuestionId(questionId);
		Question existingQuestion = questionRepository.findById(questionId).orElse(null);
		question.setCreatedAt(existingQuestion.getCreatedAt());
		question.setUpdatedAt(LocalDateTime.now());
		return questionRepository.save(question);
	}
	
	public void deleteQuestion(Integer questionId) {
		questionRepository.deleteById(questionId);
	}
	
	public List<Question> getQuestionByDomainId(Integer domainId){
		return questionRepository.findByDomainId(domainId);
	}


}
