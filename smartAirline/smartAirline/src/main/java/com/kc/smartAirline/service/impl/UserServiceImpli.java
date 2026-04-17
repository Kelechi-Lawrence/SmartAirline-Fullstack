package com.kc.smartAirline.service.impl;

import com.kc.smartAirline.dtos.Response;
import com.kc.smartAirline.dtos.UserDTO;
import com.kc.smartAirline.entities.User;
import com.kc.smartAirline.exceptions.NotFoundException;
import com.kc.smartAirline.repo.UserRepo;
import com.kc.smartAirline.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static java.util.stream.DoubleStream.builder;

@Service
@Slf4j
@RequiredArgsConstructor

public class UserServiceImpli implements UserService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    @Override
    public User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email)
                .orElseThrow(()-> new NotFoundException("Email not Found"));
    }

    @Override
    @Transactional
    public Response<?> updateMyAccount(UserDTO userDTO) {
     User user = currentUser();//current info
     if(userDTO.getName() != null && !userDTO.getName().isBlank()){
         user.setName(userDTO.getName());
     }
     //update phone number
     if(userDTO.getPhoneNumber() != null && !userDTO.getPhoneNumber().isBlank()){
         user.setPhoneNumber(userDTO.getPhoneNumber());
     }
        //update password
     if(userDTO.getPassword() != null && !userDTO.getPassword().isBlank()){
         String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
         user.setPassword(encodedPassword);
     }
      user.setUpdatedAt(LocalDateTime.now());
     userRepo.save(user);
        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Updated successfully")
                .build();
    }

    @Override
    public Response<List<UserDTO>> getAllPilots() {
        log.info("inside getAllPilots()");
      List<UserDTO> pilots =userRepo.findByRoles_Role("PILOT").stream()
              .map(user -> modelMapper.map(user,UserDTO.class))
              .toList();
        return Response.<List<UserDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message(pilots.isEmpty() ? "No pilot Found" : "Retrieved pilot successfully")
                .data(pilots)
                .build();

    }

    @Override
    public Response<UserDTO> getAccountDetails() {
        log.info("Inside getAccountDetails()");
        User user = currentUser();
       UserDTO userDto = modelMapper.map(user, UserDTO.class);

       return Response.<UserDTO>builder()
               .statusCode(HttpStatus.OK.value())
               .data(userDto)
               .message("good")
               .build();

    }
}
