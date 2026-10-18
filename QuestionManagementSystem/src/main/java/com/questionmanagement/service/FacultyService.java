package com.questionmanagement.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.questionmanagement.entity.Faculty;
import com.questionmanagement.repository.FacultyRepository;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;

    // Constructor
    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }


    // 1. Add Faculty
    public Faculty addFaculty(Faculty faculty) {

        faculty.setFacultyId(null);
        faculty.setStatus("ACTIVE");
        faculty.setCreatedAt(LocalDateTime.now());

        return facultyRepository.save(faculty);
    }


    // 2. Add Multiple Faculty
    public List<Faculty> addMultipleFaculty(List<Faculty> facultyList) {

        for (Faculty faculty : facultyList) {

            faculty.setFacultyId(null);
            faculty.setStatus("ACTIVE");
            faculty.setCreatedAt(LocalDateTime.now());
        }

        return facultyRepository.saveAll(facultyList);
    }


    // 3. View All Faculty
    public List<Faculty> getAllFaculty() {

        return facultyRepository.findAll();
    }


    // 4. View Faculty by ID
    public Faculty getFacultyById(Integer id) {

        return facultyRepository.findById(id).orElse(null);
    }


    // 5. Update Faculty
    public Faculty updateFaculty(Integer id, Faculty faculty) {

        Faculty existing = facultyRepository.findById(id).orElse(null);

        if (existing != null) {

            existing.setEmployeeId(faculty.getEmployeeId());
            existing.setFacultyName(faculty.getFacultyName());
            existing.setEmail(faculty.getEmail());
            existing.setDomainId(faculty.getDomainId());
            existing.setStatus(faculty.getStatus());

            return facultyRepository.save(existing);
        }

        return null;
    }


    // 6. Delete Faculty
    public void deleteFaculty(Integer id) {

        facultyRepository.deleteById(id);
    }


    // 7. Deactivate Faculty
    public Faculty deactivateFaculty(Integer id) {

        Faculty faculty = facultyRepository.findById(id).orElse(null);

        if (faculty != null) {

            faculty.setStatus("INACTIVE");

            return facultyRepository.save(faculty);
        }

        return null;
    }
}