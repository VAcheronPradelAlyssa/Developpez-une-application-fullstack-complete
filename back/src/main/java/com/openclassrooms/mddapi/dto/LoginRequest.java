package com.openclassrooms.mddapi.dto;

public class LoginRequest {
    private String emailOrUsername;
    private String password;

    public LoginRequest() {}

    public String getEmailOrUsername() {
        return emailOrUsername;
    }

    public void setEmailOrUsername(String emailOrUsername) {
        this.emailOrUsername = emailOrUsername;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
