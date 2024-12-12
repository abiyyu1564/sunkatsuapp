package com.sunkatsu.backend.models;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "owners")
public class Owner extends User {
    private String contactInfo;


    public Owner() {
    }

    public Owner(String id, String username, String password, Role role, String contactInfo, Status status) {
        super(id, username, password, role, status);
        this.contactInfo = contactInfo;
    }

    public String getContactInfo() {
        return this.contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public Owner contactInfo(String contactInfo) {
        setContactInfo(contactInfo);
        return this;
    }
}
