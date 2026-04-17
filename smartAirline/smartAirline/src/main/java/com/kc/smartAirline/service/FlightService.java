package com.kc.smartAirline.service;

import com.kc.smartAirline.dtos.CreateFlightRequest;
import com.kc.smartAirline.dtos.FlightDTO;
import com.kc.smartAirline.dtos.Response;
import com.kc.smartAirline.dtos.UpdateFlightRequest;
import com.kc.smartAirline.entities.Flight;
import com.kc.smartAirline.enums.City;
import com.kc.smartAirline.enums.Country;
import com.kc.smartAirline.enums.FlightStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface FlightService {
    Response<?> createFlight(CreateFlightRequest createFlightRequest);
    Response<FlightDTO> getFlightById( UUID id);
    Response<List<FlightDTO>> getAllFlight();
    Response<Flight> updateFlight(UpdateFlightRequest updateFlightRequest);
    Response<List<FlightDTO>> searchFlight(String departureTimeIataCode, String arrivalTimeIataCode, FlightStatus status, LocalDateTime departureTime);
    Response<List<City>> getAllCity();
    Response<List<Country>> getAllCountry();
}
