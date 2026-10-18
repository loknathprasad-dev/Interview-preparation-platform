package com.questionmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.questionmanagement.entity.HelpTicket;

public interface HelpTicketRepository
        extends JpaRepository<HelpTicket, Integer> {

}