package com.questionmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.questionmanagement.entity.HelpReply;

public interface HelpReplyRepository
        extends JpaRepository<HelpReply, Integer> {

    List<HelpReply> findByTicketId(Integer ticketId);

}