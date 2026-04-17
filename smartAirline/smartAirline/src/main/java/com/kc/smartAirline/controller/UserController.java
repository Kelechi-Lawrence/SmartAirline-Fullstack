package com.kc.smartAirline.controller;

import com.kc.smartAirline.dtos.Response;
import com.kc.smartAirline.dtos.RoleDTO;
import com.kc.smartAirline.dtos.UserDTO;
import com.kc.smartAirline.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    @PutMapping("/update")
    public ResponseEntity<Response<?>> createRole(@RequestBody UserDTO userDTO){
        return ResponseEntity.ok(userService.updateMyAccount(userDTO));
    }
    @GetMapping("/pilots")
    public ResponseEntity<Response<List<UserDTO>>> getAllPilot() {
        return ResponseEntity.ok(userService.getAllPilots());
    }

    @GetMapping("/details")
    public ResponseEntity<Response<UserDTO>> getAccountDetails() {
        return ResponseEntity.ok(userService.getAccountDetails());
    }

}
