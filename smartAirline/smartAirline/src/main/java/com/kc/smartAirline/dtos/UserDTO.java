package com.kc.smartAirline.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kc.smartAirline.entities.Role;
import com.kc.smartAirline.enums.AuthMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {


    private UUID id;
    private String name;

    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String phoneNumber;
    private boolean emailVerified;

    //For oauth authentication

    private AuthMethod authMethod;
    private String providerId;
    //multiple users have different roles and immediately fetch role when creating a user

    private List<Role> roles =new ArrayList<>();

    private boolean active;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
