package com.sunkatsu.backend.controllers;

import com.sunkatsu.backend.models.Owner;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owner")
public class OwnerController {

    @GetMapping
    public String get(){
        return "Get Owner";
    }

    @PutMapping
    public String put(){
        return "Put Owner";
    }

    @PostMapping
    public String post(){
        return "Post Owner";
    }

    @DeleteMapping
    public String delete(){
        return "Delete Owner";
    }
}
