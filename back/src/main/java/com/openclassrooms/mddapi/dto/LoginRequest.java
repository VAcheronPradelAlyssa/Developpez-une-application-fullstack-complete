package com.openclassrooms.mddapi.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginRequest {
    private String emailOrUsername;
    private String password;
}
