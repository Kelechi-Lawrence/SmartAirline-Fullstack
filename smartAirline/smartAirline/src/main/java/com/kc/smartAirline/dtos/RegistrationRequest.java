package com.kc.smartAirline.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationRequest {
    private UUID id;
    @NotBlank(message = "name is required")
    private String name;
@NotBlank(message = "email required")
@Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "password required")
    @Size(min = 3, message = "password must be three characters long")
    private String password;
    private String phoneNumber;
    private List<String> roles;


}
