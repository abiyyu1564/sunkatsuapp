package com.sunkatsu.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sunkatsu.backend.models.Staff;
import com.sunkatsu.backend.services.StaffService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/staff")
public class StaffController {
    @Autowired
    private StaffService staffService;

    @Operation(
        summary = "Get all staff",
        description = "Get all staff"
    )
    @GetMapping
    public List<Staff> getAllStaff() {
        return staffService.findAllStaffs();
    }

    @Operation(
        summary = "Get staff by id",
        description = "Get staff by id"
    )
    @GetMapping("/{id}")
    public Staff getStaffById(@PathVariable String id) {
        return staffService.findStaffById(id);
    }

    @Operation(
        summary = "Create staff",
        description = "Create staff"
    )
    @PostMapping
    public Staff createStaff(@Payload Staff staff)  {
        return staffService.createStaff(staff);
    }
}
