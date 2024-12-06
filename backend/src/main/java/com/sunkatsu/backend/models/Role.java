package com.sunkatsu.backend.models;

import com.sunkatsu.backend.models.Permission;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import lombok.Getter;

import java.util.Set;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import static com.sunkatsu.backend.models.Permission.*;

@RequiredArgsConstructor
public enum Role {

    CUSTOMER(Collections.emptySet()),
    STAFF(
            Set.of(
                    STAFF_DELETE,
                    STAFF_CREATE,
                    STAFF_READ,
                    STAFF_UPDATE
            )
    ),
    OWNER(
        Set.of(
            OWNER_READ,
            OWNER_CREATE,
            OWNER_UPDATE,
            OWNER_DELETE
        )
    )
    ;

    @Getter
    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
