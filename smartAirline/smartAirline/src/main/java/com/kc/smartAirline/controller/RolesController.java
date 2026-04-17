package com.kc.smartAirline.controller;

import com.kc.smartAirline.dtos.Response;
import com.kc.smartAirline.dtos.RoleDTO;
import com.kc.smartAirline.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/roles")

public class RolesController {
    private final RoleService roleService;

    @PostMapping("/create")
//    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response<?>> createRole(@Valid @RequestBody RoleDTO roleDTO){
        return ResponseEntity.ok(roleService.createRole(roleDTO));

    }

    @PutMapping("/update")
//      @PreAuthorize("hasAuthority('ADMIN')")
        public ResponseEntity<Response<?>> updateRole(@RequestBody RoleDTO roleDTO){
            return ResponseEntity.ok(roleService.updateRole(roleDTO));

        }
    @GetMapping("/getroles")
//    @PreAuthorize("hasAnyAuthority('ADMIN','PILOT')")
    public ResponseEntity<Response<?>> getAllRoles(){
        return ResponseEntity.ok(roleService.getAllRole());
    }
}
