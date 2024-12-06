package com.sunkatsu.backend.models;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {
    OWNER_READ("owner:read"),
    OWNER_CREATE("owner:create"),
    OWNER_UPDATE("owner:update"),
    OWNER_DELETE("owner:delete"),
    STAFF_READ("staff:read"),
    STAFF_CREATE("staff:create"),
    STAFF_UPDATE("staff:update"),
    STAFF_DELETE("staff:delete")
    ;

    @Getter
    private final String permission;
}
