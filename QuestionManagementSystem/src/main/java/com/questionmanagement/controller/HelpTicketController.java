package com.questionmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.questionmanagement.entity.HelpTicket;
import com.questionmanagement.service.HelpTicketService;

@RestController
@RequestMapping("/api/help-tickets")
@CrossOrigin
public class HelpTicketController {

    @Autowired
    private HelpTicketService service;

    // Add Ticket
    @PostMapping
    public HelpTicket addTicket(@RequestBody HelpTicket ticket) {

        return service.addTicket(ticket);
    }

    // View All Tickets
    @GetMapping
    public List<HelpTicket> getAllTickets() {

        return service.getAllTickets();
    }

    // View Ticket By ID
    @GetMapping("/{ticketId}")
    public HelpTicket getTicketById(
            @PathVariable Integer ticketId) {

        return service.getTicketById(ticketId);
    }

    // View Tickets By User
    @GetMapping("/user/{userId}")
    public List<HelpTicket> getTicketsByUserId(
            @PathVariable Integer userId) {

        return service.getTicketsByUserId(userId);
    }

    // Update Ticket
    @PutMapping("/{ticketId}")
    public HelpTicket updateTicket(
            @PathVariable Integer ticketId,
            @RequestBody HelpTicket ticket) {

        return service.updateTicket(ticketId, ticket);
    }

    // Delete Ticket
    @DeleteMapping("/{ticketId}")
    public void deleteTicket(@PathVariable Integer ticketId) {

        service.deleteTicket(ticketId);
    }
}