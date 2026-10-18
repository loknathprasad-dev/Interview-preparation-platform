package com.questionmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.questionmanagement.entity.HelpReply;
import com.questionmanagement.service.HelpReplyService;

@RestController
@RequestMapping("/api/help-replies")
@CrossOrigin(origins = "*")
public class HelpReplyController {

    @Autowired
    private HelpReplyService replyService;

    // 1. Add Reply
    @PostMapping
    public ResponseEntity<HelpReply> addReply(
            @RequestBody HelpReply reply) {

        HelpReply savedReply = replyService.addReply(reply);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedReply);
    }

    // 2. Get All Replies
    @GetMapping
    public List<HelpReply> getAllReplies() {

        return replyService.getAllReplies();
    }

    // 3. Get Replies By Ticket ID
    @GetMapping("/ticket/{ticketId}")
    public List<HelpReply> getRepliesByTicketId(
            @PathVariable Integer ticketId) {

        return replyService.getRepliesByTicketId(ticketId);
    }

    // 4. Delete Reply
    @DeleteMapping("/{replyId}")
    public ResponseEntity<String> deleteReply(
            @PathVariable Integer replyId) {

        replyService.deleteReply(replyId);

        return ResponseEntity.ok("Reply deleted successfully");
    }
}