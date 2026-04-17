package com.kc.smartAirline.controller;

import com.kc.smartAirline.dtos.*;
import com.kc.smartAirline.enums.City;
import com.kc.smartAirline.enums.Country;
import com.kc.smartAirline.enums.FlightStatus;
import com.kc.smartAirline.service.FlightService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/flight")
@CrossOrigin(origins =  "http://localhost:5173")
public class FlightController {
    private final FlightService flightService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','PILOT')")
    public ResponseEntity<Response<?>> createFlight(@Valid @RequestBody CreateFlightRequest createFlightRequest){
        return ResponseEntity.ok(flightService.createFlight(createFlightRequest));

    }
    @PutMapping("/update")
    @PreAuthorize("hasAnyAuthority('ADMIN','PILOT')")
    public ResponseEntity<Response<?>> updateFlight(@Valid @RequestBody UpdateFlightRequest updateFlightRequest){
        return ResponseEntity.ok(flightService.updateFlight(updateFlightRequest));

    }
    @GetMapping("/AllFlights")
    public ResponseEntity<Response<List<FlightDTO>>> getAllFlight(){
        return ResponseEntity.ok(flightService.getAllFlight());
    }
    @GetMapping("/search")
    public ResponseEntity<Response<List<FlightDTO>>> searchFlight(
            @RequestParam String departureTimeIataCode,
            @RequestParam String arrivalTimeIataCode,
            @RequestParam (required = false,defaultValue = "SCHEDULED") FlightStatus status,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureTime
    ) {
        return ResponseEntity.ok(
                flightService.searchFlight(
                        departureTimeIataCode,
                        arrivalTimeIataCode,
                        status,
                        departureTime
                )
        );
    }
    @GetMapping("/cities")
    public ResponseEntity<Response<List<City>>> getAllCities(){
        return ResponseEntity.ok(flightService.getAllCity());
    }
    @GetMapping("/Countries")
    public ResponseEntity<Response<List<Country>>> getAllCountries(){
        return ResponseEntity.ok(flightService.getAllCountry());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response<FlightDTO>> getFlight(@PathVariable UUID id){
        return ResponseEntity.ok(flightService.getFlightById(id));
    }
}
