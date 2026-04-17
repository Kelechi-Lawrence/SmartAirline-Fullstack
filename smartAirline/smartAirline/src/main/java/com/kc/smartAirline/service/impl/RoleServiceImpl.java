package com.kc.smartAirline.service.impl;

import com.kc.smartAirline.dtos.Response;
import com.kc.smartAirline.dtos.RoleDTO;
import com.kc.smartAirline.entities.Role;
import com.kc.smartAirline.exceptions.NotFoundException;
import com.kc.smartAirline.repo.RoleRepo;
import com.kc.smartAirline.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
@Slf4j
public class RoleServiceImpl implements RoleService {

    private final RoleRepo roleRepo;
    private final ModelMapper modelMapper;

    @Override
    public Response<?> createRole(RoleDTO roleDTO) {
        log.info("createRole()");

        // DTO -> Entity
        Role role = modelMapper.map(roleDTO, Role.class);
        role.setRole(role.getRole().toUpperCase());

        roleRepo.save(role);

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Created role successfully")
                .build();
    }

    @Override
    public Response<?> updateRole(RoleDTO roleDTO) {
        Long id = roleDTO.getId();
        Role existingRole = roleRepo.findById(id)//checking if ot exist
                .orElseThrow(() -> new NotFoundException("role not found"));
        existingRole.setRole(roleDTO.getRole().toUpperCase());
        roleRepo.save(existingRole);
        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Updated successfully")
                .build();

    }

    @Override
    public Response<List<RoleDTO>> getAllRole() {

        List<RoleDTO> roles = roleRepo.findAll()
                .stream()
                .map(role -> modelMapper.map(role, RoleDTO.class))
                .toList();

        return Response.<List<RoleDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message(roles.isEmpty() ? "Role not found" : "Roles retrieved successfully")
                .data(roles)
                .build();
    }
}