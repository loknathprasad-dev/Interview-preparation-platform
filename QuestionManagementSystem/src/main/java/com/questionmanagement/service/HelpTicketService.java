package com.questionmanagement.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.questionmanagement.entity.HelpTicket;
import com.questionmanagement.repository.HelpTicketRepository;

@Service
public class HelpTicketService {

    @Autowired
    private HelpTicketRepository repository;

    // Add Ticket
    public HelpTicket addTicket(HelpTicket ticket) {

        ticket.setTicketId(null);
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setResolvedAt(null);

        return repository.save(ticket);
    }

    // View All Tickets
    public List<HelpTicket> getAllTickets() {

        return repository.findAll();
    }

    // View Ticket By ID
    public HelpTicket getTicketById(Integer ticketId) {

        return repository.findById(ticketId).orElse(null);
    }

    // View Tickets By User ID
    public List<HelpTicket> getTicketsByUserId(Integer userId) {

        return repository.findAll()
                .stream()
                .filter(ticket -> userId.equals(ticket.getUserId()))
                .toList();
    }

    // Update Ticket
    public HelpTicket updateTicket(Integer ticketId,
                                   HelpTicket ticket) {

        HelpTicket existing = repository.findById(ticketId)
                .orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setSubject(ticket.getSubject());
        existing.setDescription(ticket.getDescription());

        return repository.save(existing);
    }

    // Delete Ticket
    public void deleteTicket(Integer ticketId) {

        repository.deleteById(ticketId);
    }
}