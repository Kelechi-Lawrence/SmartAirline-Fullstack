package com.kc.smartAirline.service.impl;

import com.kc.smartAirline.dtos.LoginRequest;
import com.kc.smartAirline.dtos.LoginResponse;
import com.kc.smartAirline.dtos.RegistrationRequest;
import com.kc.smartAirline.dtos.Response;
import com.kc.smartAirline.entities.Role;
import com.kc.smartAirline.entities.User;
import com.kc.smartAirline.enums.AuthMethod;
import com.kc.smartAirline.exceptions.BadRequestException;
import com.kc.smartAirline.exceptions.NotFoundException;
import com.kc.smartAirline.repo.RoleRepo;
import com.kc.smartAirline.repo.UserRepo;
import com.kc.smartAirline.security.JwtUtils;
import com.kc.smartAirline.service.AuthService;
import com.kc.smartAirline.service.EmailNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final RoleRepo roleRepo;
    private final EmailNotificationService emailNotificationService;
    @Override
    public Response<?> register(RegistrationRequest registrationRequest) {
        log.info("Inside register()");

        //  Checking if the user already exists
        if(userRepo.existsByEmail(registrationRequest.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        // Handle roles
        List<Role> userRoles;
        if (registrationRequest.getRoles() != null && !registrationRequest.getRoles().isEmpty()) {

            //  restrict allowed roles.

            userRoles = registrationRequest.getRoles().stream()
                    .map(roleName -> {
                        // Allow both CUSTOMER and PILOT
                        if (!roleName.equalsIgnoreCase("CUSTOMER") && !roleName.equalsIgnoreCase("PILOT")) {
                            throw new BadRequestException("Invalid role assignment: " + roleName);
                        }

                        return roleRepo.findByRole(roleName.toUpperCase())
                                .orElseThrow(() -> new BadRequestException("Role not found: " + roleName));
                    })
                    .toList();

        } else {
            Role defaultRole = roleRepo.findByRole("CUSTOMER")
                    .orElseThrow(() -> new RuntimeException("Default role CUSTOMER not found"));
            userRoles = List.of(defaultRole);
        }
        User userToSave = new User();
        userToSave.setName(registrationRequest.getName());
        userToSave.setEmail(registrationRequest.getEmail());
        userToSave.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        userToSave.setPhoneNumber(registrationRequest.getPhoneNumber());

        userToSave.setAuthMethod(AuthMethod.LOCAL);
        userToSave.setCreatedAt(LocalDateTime.now());
        userToSave.setUpdatedAt(LocalDateTime.now());
        userToSave.setActive(true);
        userToSave.setEmailVerified(false); // or it defaults to false

        userToSave.setRoles(userRoles);
        User savedUser = userRepo.save(userToSave);

        emailNotificationService.sendWelcomeEmail(savedUser);
        return Response.builder()
                .statusCode(200)
                .message("User registered successfully")
                .build();
    }
    @Override
    public Response<LoginResponse> login(LoginRequest loginRequest) {
        log.info("Inside login()");
        User user = userRepo.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new NotFoundException("Email not found"));
        if (!user.isActive()) {
            throw new NotFoundException("account not active see customer care");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadRequestException("invalid password");
        }
        String token = jwtUtils.generateToken(user.getEmail());

        List<String> roleName = user.getRoles()
                .stream().map(Role::getRole)
                .toList();
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(token);
        loginResponse.setRoles(roleName);


        return Response.<LoginResponse>builder()
                .statusCode(200)
                .message("Successfully logged in")
                .data(loginResponse)
                .build();
    }
    }
