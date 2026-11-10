package com.interfinix.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "faculty_domains")
@Data
public class FacultyDomain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "faculty_id", nullable = false)
    private Integer facultyId;

    @Column(name = "domain_id", nullable = false)
    private Integer domainId;
}