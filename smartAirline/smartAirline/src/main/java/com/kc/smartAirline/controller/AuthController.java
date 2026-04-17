package com.kc.smartAirline.controller;

import com.kc.smartAirline.dtos.*;
import com.kc.smartAirline.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin(origins =  "http://localhost:5173")
public class AuthController {
    private final AuthService authService;
    //    register user
    @PostMapping("/register")
    public ResponseEntity<Response<?>> register(@RequestBody RegistrationRequest registrationRequest){
        return ResponseEntity.ok(authService.register(registrationRequest));

    }
    //    login user
    @PostMapping("/login")
    public ResponseEntity<Response<LoginResponse>> login(@RequestBody LoginRequest loginRequest){
        return ResponseEntity.ok(authService.login(loginRequest));

    }

}
