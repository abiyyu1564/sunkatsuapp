package com.sunkatsu.backend.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sunkatsu.backend.dto.Message;
import com.sunkatsu.backend.dto.StaffDTO;
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
    public ResponseEntity<Object> getAllStaff() {
        List<Staff> listStaff = staffService.findAllStaffs();
        List<StaffDTO> allStaff = new ArrayList<>();
        for (Staff s : listStaff) {
            allStaff.add(staffService.convertToDTO(s));
        }
        return ResponseEntity.ok(allStaff);
    }

    @Operation(
        summary = "Get staff by id",
        description = "Get staff by id"
    )
    @GetMapping("/{id}")
    public ResponseEntity<Object> getStaffById(@PathVariable String id) {
        try {
            var staff = staffService.findStaffById(id);
            return ResponseEntity.ok(staffService.convertToDTO(staff));
        } catch(RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        
    }

    @Operation(
        summary = "Create staff",
        description = "Create staff"
    )
    @PostMapping
    public ResponseEntity<Object> createStaff(@Payload Staff staff)  {
        Pattern pattern = Pattern.compile("[^a-z0-9 ]", Pattern.CASE_INSENSITIVE);
        Matcher matchUsername = pattern.matcher(staff.getUsername());
        Matcher matchRoleDetail = pattern.matcher(staff.getRoleDetail());
        if (matchUsername.find() || matchRoleDetail.find() || !staff.verify()) {
            return ResponseEntity.badRequest().body(new Message("Error : Invalid username or role detail"));
        }
        return ResponseEntity.ok(staffService.createStaff(staff));
    }

    
}
