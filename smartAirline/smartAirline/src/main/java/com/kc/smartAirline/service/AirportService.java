package com.kc.smartAirline.service;

import com.kc.smartAirline.dtos.AirportDTO;
import com.kc.smartAirline.dtos.Response;

import java.util.List;
import java.util.UUID;

public interface AirportService {
    Response<?> createAirport(AirportDTO airportDTO);
    Response<AirportDTO> updateAirport(AirportDTO airportDTO);
    Response<List<AirportDTO>> getAllAirports();
    Response<AirportDTO> getAirportById(UUID id);
}
