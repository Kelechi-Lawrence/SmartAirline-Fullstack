package com.kc.smartAirline.service;

import com.kc.smartAirline.dtos.Response;
import com.kc.smartAirline.dtos.UserDTO;
import com.kc.smartAirline.entities.User;

import java.util.List;

public interface UserService {

    User currentUser();
   Response<?> updateMyAccount(UserDTO userDTO);
    Response<List<UserDTO>> getAllPilots();
    Response<UserDTO> getAccountDetails();
}
