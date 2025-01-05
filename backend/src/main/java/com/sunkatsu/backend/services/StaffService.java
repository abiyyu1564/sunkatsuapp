package com.sunkatsu.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sunkatsu.backend.dto.StaffDTO;
import com.sunkatsu.backend.models.Customer;
import com.sunkatsu.backend.models.Staff;
import com.sunkatsu.backend.models.Status;
import com.sunkatsu.backend.repositories.StaffRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StaffService {
    @Autowired
    private final StaffRepository staffRepository;

    @Autowired
    private final SequenceGeneratorService sequenceGeneratorService;

    public Staff findStaffById(String staffId) {
        return staffRepository.findById(staffId).orElseThrow(() -> 
            new RuntimeException("Staff not found"));
    }

    public List<Staff> findAllStaffs() {
        return staffRepository.findAll();
    }

    public List<Staff> findAllByStatus(Status status) {
        return staffRepository.findAllByStatus(status);
    }

    public Staff createStaff(Staff staff) {
        staff.setId(String.valueOf(sequenceGeneratorService.generateSequence(Customer.SEQUENCE_NAME)));
        return staffRepository.save(staff);
    }

    public void saveStaff(Staff staff) {
        staff.setStatus(Status.ONLINE);
        staffRepository.save(staff);
    }

    public Optional<Staff> getStaffByUsername(String username) {
        return staffRepository.findByUsername(username);
    }

    public Staff getStaffById(String id) {
        return staffRepository.findById(id).orElse(null);
    }

    public StaffDTO convertToDTO(Staff staff) {
        return new StaffDTO(
            staff.getId(),
            staff.getUsername(),
            staff.getRole(),
            staff.getStatus(),
            staff.getRoleDetail()
        );
    }
}
