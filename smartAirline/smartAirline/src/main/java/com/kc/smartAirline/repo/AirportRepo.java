package com.kc.smartAirline.repo;

import com.kc.smartAirline.entities.Airport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AirportRepo extends JpaRepository<Airport, UUID> {

    Optional<Airport> findByIataCode(String iataCode);
}
