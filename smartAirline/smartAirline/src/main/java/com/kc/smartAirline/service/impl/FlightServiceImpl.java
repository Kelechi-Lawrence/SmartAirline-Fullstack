package com.kc.smartAirline.service.impl;

import com.kc.smartAirline.dtos.*;
import com.kc.smartAirline.entities.Airport;
import com.kc.smartAirline.entities.Flight;
import com.kc.smartAirline.entities.User;
import com.kc.smartAirline.enums.City;
import com.kc.smartAirline.enums.Country;
import com.kc.smartAirline.enums.FlightStatus;
import com.kc.smartAirline.exceptions.BadRequestException;
import com.kc.smartAirline.exceptions.NotFoundException;
import com.kc.smartAirline.repo.AirportRepo;
import com.kc.smartAirline.repo.FlightRepo;
import com.kc.smartAirline.repo.UserRepo;
import com.kc.smartAirline.service.FlightService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
@RequiredArgsConstructor
@Slf4j

public class FlightServiceImpl implements FlightService {
    private final FlightRepo flightRepo;
    private final UserRepo userRepo;
    private final AirportRepo airportRepo;
    private final ModelMapper modelMapper;

    @Override
    public Response<?> createFlight(CreateFlightRequest createFlightRequest) {
        if (createFlightRequest.getArrivalTime().isBefore(createFlightRequest.getDepartureTime())) {

            throw new BadRequestException("Arrival time cant be before departure");
        }
        if (flightRepo.existsByFlightNumber(createFlightRequest.getFlightNumber())) {

            throw new BadRequestException("Flight already exist");
        }
        //checking if it exist
        Airport departureAirport = airportRepo.findByIataCode(createFlightRequest.getDepartureAirportIataCode())
                .orElseThrow(() -> new NotFoundException("Departure not found"));

        Airport arrivalAirport = airportRepo.findByIataCode(createFlightRequest.getArrivalAirportIataCode())
                .orElseThrow(() -> new NotFoundException("Arrival not found"));
        Flight saveFlight = new Flight();
        saveFlight.setFlightNumber(createFlightRequest.getFlightNumber());
        saveFlight.setFlightStatus(FlightStatus.SCHEDULED);
        saveFlight.setArrivalAirport(arrivalAirport);
        saveFlight.setDepartureAirport(departureAirport);
        saveFlight.setArrivalTime(createFlightRequest.getArrivalTime());
        saveFlight.setDepartureTime(createFlightRequest.getDepartureTime());
        saveFlight.setBasePrice(createFlightRequest.getBasePrice());

        //assign pilot
        if (createFlightRequest.getPilotID() != null) {
            User pilot = userRepo.findById(createFlightRequest.getPilotID())
                    .orElseThrow(() -> new NotFoundException("pilot not found"));
            boolean isPilot = pilot.getRoles().stream()
                    .anyMatch(role -> role.getRole().equalsIgnoreCase("PILOT"));
            if (!isPilot) {
                throw new BadRequestException("unauthorized, not my pilot");
            }
            saveFlight.setAssignedPilot(pilot);


        }
        flightRepo.save(saveFlight);
        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Flight created sucessfully")
                .build();
    }

    @Override
    @Transactional
    public Response<Flight> updateFlight(UpdateFlightRequest request) {

        UUID id = request.getId();

        Flight existingFlight = flightRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Flight doesn't exist"));

        //  Flight Number
        if (request.getFlightNumber() != null && !request.getFlightNumber().isBlank()) {
            if (!existingFlight.getFlightNumber().equals(request.getFlightNumber()) &&
                    flightRepo.existsByFlightNumber(request.getFlightNumber())) {
                throw new BadRequestException("Flight number already in use");
            }
            existingFlight.setFlightNumber(request.getFlightNumber());
        }

        // Departure Time
        if (request.getDepartureTime() != null) {
            existingFlight.setDepartureTime(request.getDepartureTime());
        }

        //  Arrival Time
        if (request.getArrivalTime() != null) {
            existingFlight.setArrivalTime(request.getArrivalTime());
        }

        //  Validate time logic if both exist
        if (existingFlight.getArrivalTime() != null && existingFlight.getDepartureTime() != null &&
                existingFlight.getArrivalTime().isBefore(existingFlight.getDepartureTime())) {
            throw new BadRequestException("Arrival time cannot be before departure time");
        }

        //  Departure Airport
        if (request.getDepartureAirportIataCode() != null && !request.getDepartureAirportIataCode().isBlank()) {
            Airport departureAirport = airportRepo.findByIataCode(request.getDepartureAirportIataCode())
                    .orElseThrow(() -> new NotFoundException("Departure airport not found"));
            existingFlight.setDepartureAirport(departureAirport);
        }

        // Arrival Airport
        if (request.getArrivalAirportIataCode() != null && !request.getArrivalAirportIataCode().isBlank()) {
            Airport arrivalAirport = airportRepo.findByIataCode(request.getArrivalAirportIataCode())
                    .orElseThrow(() -> new NotFoundException("Arrival airport not found"));
            existingFlight.setArrivalAirport(arrivalAirport);
        }

        //  Base Price
        if (request.getBasePrice() != null) {
            if (request.getBasePrice().signum() <= 0) {
                throw new BadRequestException("Base price must be greater than zero");
            }
            existingFlight.setBasePrice(request.getBasePrice());
        }

        // Flight Status
        if (request.getFlightStatus() != null) {
            existingFlight.setFlightStatus(request.getFlightStatus());
        }

        // Assign / Change Pilot
        if (request.getPilotID() != null) {
            User pilot = userRepo.findById(request.getPilotID())
                    .orElseThrow(() -> new NotFoundException("pilot not found"));
            boolean isPilot = pilot.getRoles().stream()
                    .anyMatch(role -> role.getRole().equalsIgnoreCase("PILOT"));
            if (!isPilot) {
                throw new BadRequestException("unauthorized, not my pilot");
            }
            existingFlight.setAssignedPilot(pilot);
        }

        flightRepo.save(existingFlight);

        return Response.<Flight>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Flight updated successfully")
                .data(existingFlight)
                .build();
    }


    @Override
    public Response<FlightDTO> getFlightById(UUID id) {
        Flight flight = flightRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("flight doesnt exist"));
        //map to dto class
        FlightDTO flightDTO = modelMapper.map(flight, FlightDTO.class);
// TO ESCAPE RECURSIVE
        if (flightDTO.getBookings() != null) {
            flightDTO.getBookings().forEach(BookingDTO -> BookingDTO.setFlight(null));
        }

        return Response.<FlightDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Flight retrived sucessfully")
                .data(flightDTO)
                .build();
    }

    @Override
    public Response<List<FlightDTO>> getAllFlight() {
        // cus uuid cant just do desc since isn't long
        Sort sortByDec = Sort.by(Sort.Direction.DESC, "createdAt");

        List<FlightDTO> flightDTOS = flightRepo.findAll(sortByDec)
                .stream().map(flights -> modelMapper.map(flights, FlightDTO.class))
                .toList();


        return Response.<List<FlightDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("flight retrieved sucessfully")
                .data(flightDTOS)
                .build();
    }

    @Override
    public Response<List<FlightDTO>> searchFlight(
            String departureIataCode,
            String arrivalIataCode,
            FlightStatus status,
            LocalDateTime departureTime) {

        if (departureTime == null) {
            throw new BadRequestException("Departure date is required for flight search");
        }

        LocalDate date = departureTime.toLocalDate();
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        List<Flight> flights = flightRepo
                .findByDepartureAirport_IataCodeAndArrivalAirport_IataCodeAndFlightStatusAndDepartureTimeBetween(
                        departureIataCode,
                        arrivalIataCode,
                        status,
                        startOfDay,
                        endOfDay
                );

        List<FlightDTO> flightDTOs = flights.stream()
                .map(flight -> {
                    FlightDTO dto = modelMapper.map(flight, FlightDTO.class);
                    dto.setAssignedPilot(null);
                    dto.setBookings(null);

                    return dto;
                })
                .toList();

        return Response.<List<FlightDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Flights retrieved successfully")
                .data(flightDTOs)
                .build();
    }


    @Override
    public Response<List<City>> getAllCity() {

        return Response.<List<City>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Cities found")
                .data(List.of(City.values()))
                .build();
    }

    @Override
    public Response<List<Country>> getAllCountry() {
        return Response.<List<Country>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Countries found")
                .data(List.of(Country.values()))
                .build();
    }
}