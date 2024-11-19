package com.sunkatsu.backend.dto;

import com.sunkatsu.backend.models.Status;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private String id;
    private String username;
    private String role;
    private Status status;
}
    