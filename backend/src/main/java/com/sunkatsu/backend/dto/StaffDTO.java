package com.sunkatsu.backend.dto;

import com.sunkatsu.backend.models.Status;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffDTO {
    private String id;
    private String username;
    private String role;
    private Status status;
    private String roleDetail;
}
