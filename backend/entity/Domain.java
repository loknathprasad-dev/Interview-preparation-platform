package com.interfinix.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "domains")
@Data
public class Domain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "domain_id")
    private Integer id;

    @Column(name = "domain_name", nullable = false, unique = true, length = 100)
    private String domainName;

    @Column(length = 255)
    private String description;
}