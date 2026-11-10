package com.interfinix.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.interfinix.backend.entity.FacultyDomain;

public interface FacultyDomainRepository extends JpaRepository<FacultyDomain, Integer> {

    List<FacultyDomain> findByFacultyId(Integer facultyId);

    boolean existsByDomainId(Integer domainId);

    @Modifying
    @Query("delete from FacultyDomain fd where fd.facultyId = :facultyId")
    void deleteByFacultyId(@Param("facultyId") Integer facultyId);
}