package com.questionmanagement.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.questionmanagement.entity.HelpReply;
import com.questionmanagement.repository.HelpReplyRepository;
import com.questionmanagement.repository.HelpTicketRepository;

@Service
public class HelpReplyService {

    @Autowired
    private HelpReplyRepository replyRepository;

    @Autowired
    private HelpTicketRepository ticketRepository;

    // Add Reply
    public HelpReply addReply(HelpReply reply) {

        if (!ticketRepository.existsById(reply.getTicketId())) {
            throw new IllegalArgumentException("Ticket not found");
        }

        reply.setReplyId(null);
        reply.setCreatedAt(LocalDateTime.now());

        return replyRepository.save(reply);
    }

    // View All Replies
    public List<HelpReply> getAllReplies() {

        return replyRepository.findAll();
    }

    // View Replies By Ticket ID
    public List<HelpReply> getRepliesByTicketId(Integer ticketId) {

        return replyRepository.findByTicketId(ticketId);
    }

    // Delete Reply
    public void deleteReply(Integer replyId) {

        replyRepository.deleteById(replyId);
    }
}