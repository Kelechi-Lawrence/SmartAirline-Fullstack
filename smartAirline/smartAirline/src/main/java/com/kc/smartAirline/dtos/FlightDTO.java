package com.kc.smartAirline.dtos;

import com.kc.smartAirline.enums.FlightStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FlightDTO {
    private UUID id;

    private String flightNumber;

    private FlightStatus flightStatus;

    private AirportDTO departureAirport;

    private AirportDTO arrivalAirport;
    private LocalDateTime arrivalTime;
    private LocalDateTime departureTime;
    private BigDecimal basePrice;

    private UserDTO assignedPilot;

    private List<BookingDTO> bookings ;
    private String arrivalTimeIataCode;
    private String departureTimeIataCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
