package com.questionmanagement.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.questionmanagement.entity.Faculty;
import com.questionmanagement.service.FacultyService;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "*")
public class FacultyController {

    private final FacultyService facultyService;

    // Constructor
    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }


    // 1. Add Faculty
    @PostMapping
    public Faculty addFaculty(@RequestBody Faculty faculty) {

        return facultyService.addFaculty(faculty);
    }


    // 2. Add Multiple Faculty
    @PostMapping("/bulk")
    public List<Faculty> addMultipleFaculty(
            @RequestBody List<Faculty> facultyList) {

        return facultyService.addMultipleFaculty(facultyList);
    }


    // 3. View All Faculty
    @GetMapping
    public List<Faculty> getAllFaculty() {

        return facultyService.getAllFaculty();
    }


    // 4. View Faculty by ID
    @GetMapping("/{id}")
    public Faculty getFacultyById(@PathVariable Integer id) {

        return facultyService.getFacultyById(id);
    }


    // 5. Update Faculty
    @PutMapping("/{id}")
    public Faculty updateFaculty(
            @PathVariable Integer id,
            @RequestBody Faculty faculty) {

        return facultyService.updateFaculty(id, faculty);
    }


    // 6. Delete Faculty
    @DeleteMapping("/{id}")
    public String deleteFaculty(@PathVariable Integer id) {

        facultyService.deleteFaculty(id);

        return "Faculty deleted successfully";
    }


    // 7. Deactivate Faculty
    @PutMapping("/{id}/deactivate")
    public Faculty deactivateFaculty(@PathVariable Integer id) {

        return facultyService.deactivateFaculty(id);
    }
}