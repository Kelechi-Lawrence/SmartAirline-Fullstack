package com.kc.smartAirline.service;

import com.kc.smartAirline.dtos.LoginRequest;
import com.kc.smartAirline.dtos.LoginResponse;
import com.kc.smartAirline.dtos.RegistrationRequest;
import com.kc.smartAirline.dtos.Response;
import org.springframework.stereotype.Service;


public interface AuthService {
    Response<?> register(RegistrationRequest registrationRequest);
    Response<LoginResponse> login(LoginRequest loginRequest);
}
