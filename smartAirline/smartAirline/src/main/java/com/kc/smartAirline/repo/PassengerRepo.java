package com.kc.smartAirline.repo;

import com.kc.smartAirline.entities.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PassengerRepo extends JpaRepository<Passenger, UUID> {
}
