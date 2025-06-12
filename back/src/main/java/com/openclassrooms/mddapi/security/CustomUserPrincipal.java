package com.openclassrooms.mddapi.security;

import java.io.Serializable;

public class CustomUserPrincipal implements Serializable {
    private final Long id;
    private final String username;

    public CustomUserPrincipal(Long id, String username) {
        this.id = id;
        this.username = username;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
}