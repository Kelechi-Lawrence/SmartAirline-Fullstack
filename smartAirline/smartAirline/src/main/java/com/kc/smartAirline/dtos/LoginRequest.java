package com.kc.smartAirline.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    @NotBlank(message = "email required")
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "password required")
    @Size(min = 3, message = "password must be three characters long")
    private String password;
}
