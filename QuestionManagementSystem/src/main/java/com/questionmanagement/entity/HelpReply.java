package com.questionmanagement.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "help_replies")
public class HelpReply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reply_id")
    private Integer replyId;

    @Column(name = "ticket_id")
    private Integer ticketId;

    @Column(name = "admin_id")
    private Integer adminId;

    @Column(name = "reply_text")
    private String replyText;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}