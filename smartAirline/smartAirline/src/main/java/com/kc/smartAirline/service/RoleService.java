package com.kc.smartAirline.service;

import com.kc.smartAirline.dtos.Response;
import com.kc.smartAirline.dtos.RoleDTO;

import java.util.List;

public interface RoleService {
    Response<?> createRole(RoleDTO roleDTO);
    Response<?> updateRole(RoleDTO roleDTO);
    Response<List<RoleDTO>> getAllRole();
}
