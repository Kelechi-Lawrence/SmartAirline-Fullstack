package com.kc.smartAirline.repo;

import com.kc.smartAirline.entities.Flight;
import com.kc.smartAirline.enums.FlightStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FlightRepo extends JpaRepository<Flight, UUID> {

    boolean existsByFlightNumber(String flightNumber);

    List<Flight> findByDepartureAirport_IataCodeAndArrivalAirport_IataCodeAndFlightStatusAndDepartureTimeBetween(
            String departureIataCode,
            String arrivalIataCode,
            FlightStatus flightStatus,
            LocalDateTime startOfDay,
            LocalDateTime endOfDay
    );

}
