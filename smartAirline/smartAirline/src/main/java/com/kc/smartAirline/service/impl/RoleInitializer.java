package com.kc.smartAirline.service.impl;

import com.kc.smartAirline.entities.Role;
import com.kc.smartAirline.repo.RoleRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
@Component
@RequiredArgsConstructor
//starts immediately to assign roles
public class RoleInitializer implements CommandLineRunner {
    private final RoleRepo roleRepo;

    @Override
    public void run(String... args) {
        List<String> roles = List.of("CUSTOMER", "ADMIN", "PILOT");

        for (String roleName : roles) {
            roleRepo.findByRole(roleName)
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setRole(roleName);
                        return roleRepo.save(role);
                    });
        }
    }
}
