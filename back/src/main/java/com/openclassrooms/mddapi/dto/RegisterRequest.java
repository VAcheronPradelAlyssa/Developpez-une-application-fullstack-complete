package com.openclassrooms.mddapi.dto;

import com.openclassrooms.mddapi.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "L'email est obligatoire.")
    @Email(message = "L'email n'est pas valide.")
    private String email;

    @NotBlank(message = "Le nom d'utilisateur est obligatoire.")
    private String username;

    @ValidPassword
    private String password;
}