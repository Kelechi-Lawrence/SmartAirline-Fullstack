package com.kc.smartAirline.controller;

import com.kc.smartAirline.dtos.AirportDTO;
import com.kc.smartAirline.dtos.Response;
import com.kc.smartAirline.service.AirportService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/airports")
public class AirportController {
    private final AirportService airportService;

     @PostMapping("/createAirport")
     @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response<?>> createAirport(@RequestBody AirportDTO airportDTO){
        return ResponseEntity.ok(airportService.createAirport(airportDTO));

    }
    @PutMapping("/updateAirport")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response<AirportDTO>> updateAirport(@RequestBody AirportDTO airportDTO){
         return ResponseEntity.ok(airportService.updateAirport(airportDTO));
    }
    @GetMapping("/getAirport")
    public ResponseEntity<Response<List<AirportDTO>>> getAllAirports(){
         return ResponseEntity.ok(airportService.getAllAirports());
    }
    @GetMapping("/{id}")

    public ResponseEntity<Response<AirportDTO>> getAllAirportById(@PathVariable UUID id){
         return ResponseEntity.ok(airportService.getAirportById(id));
    }
}
