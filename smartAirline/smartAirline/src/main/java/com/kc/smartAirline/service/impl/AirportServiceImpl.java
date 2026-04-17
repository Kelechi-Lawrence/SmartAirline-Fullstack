package com.kc.smartAirline.service.impl;

import com.kc.smartAirline.dtos.AirportDTO;
import com.kc.smartAirline.dtos.Response;
import com.kc.smartAirline.entities.Airport;
import com.kc.smartAirline.enums.City;
import com.kc.smartAirline.enums.Country;
import com.kc.smartAirline.exceptions.BadRequestException;
import com.kc.smartAirline.exceptions.NotFoundException;
import com.kc.smartAirline.repo.AirportRepo;
import com.kc.smartAirline.service.AirportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class AirportServiceImpl implements AirportService {
    private final AirportRepo airportRepo;
    private final ModelMapper modelMapper;
    @Override
    public Response<?> createAirport(AirportDTO airportDTO) {
       log.info("Inside createAirport()");
    Country country = airportDTO.getCountry();
    City city = airportDTO.getCity();
     if(!city.getCountry().equals(country)){
         throw new BadRequestException("City doesnt exist");
     }
     Airport airport = modelMapper.map(airportDTO,Airport.class);
   airportRepo.save(airport);
   return Response.builder()
           .statusCode(HttpStatus.OK.value())
           .message("Airport created sucessfully")
           .build();
    }

    @Override
    public Response<AirportDTO> updateAirport(AirportDTO airportDTO) {
        log.info("Inside updateAirport()");

        if (airportDTO.getId() == null) {
            throw new BadRequestException("Airport ID is required for update");
        }

        Airport airport = airportRepo.findById(airportDTO.getId())
                .orElseThrow(() -> new BadRequestException("Airport not found"));

        Country country = airportDTO.getCountry();
        City city = airportDTO.getCity();

        if (!city.getCountry().equals(country)) {
            throw new BadRequestException("City does not belong to the selected country");
        }

        // Update only allowed fields
        airport.setName(airportDTO.getName());
        airport.setIataCode(airportDTO.getIataCode());
        airport.setCity(city);
        airport.setCountry(country);

        Airport updatedAirport = airportRepo.save(airport);

        AirportDTO updatedDTO = modelMapper.map(updatedAirport, AirportDTO.class);

        return Response.<AirportDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Airport updated successfully")
                .data(updatedDTO)
                .build();
    }


    @Override
    public Response<List<AirportDTO>> getAllAirports() {
        log.info("Inside getAllAirports()");
        List<AirportDTO> airportDTO = airportRepo.findAll().stream()
                .map(airport ->modelMapper.map(airport,AirportDTO.class) )
                .toList();
        return Response.<List<AirportDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Retrieved sucessfully")
                .data(airportDTO)
                .build();
    }

    @Override
    public Response<AirportDTO> getAirportById(UUID id) {
        Airport airport = airportRepo.findById(id)
                .orElseThrow(()->new NotFoundException("Airport not found"));
        AirportDTO airportDTO = modelMapper.map(airport, AirportDTO.class);
        return Response.<AirportDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Airport retrieved successfully")
                .data(airportDTO)
                .build();

    }
}
