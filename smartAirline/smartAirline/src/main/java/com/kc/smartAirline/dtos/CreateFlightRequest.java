package com.kc.smartAirline.dtos;

import com.kc.smartAirline.enums.FlightStatus;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateFlightRequest {
    private UUID id;
    private FlightStatus flightStatus;
    @NotBlank(message = "flight number cant be null")
    @Column(unique = true)
    private String flightNumber;
    @NotBlank(message = "departure cant be null")
    private String departureAirportIataCode ;
    @NotBlank(message = "arrival cant be null")
    private String arrivalAirportIataCode;
    private LocalDateTime arrivalTime;
    private LocalDateTime departureTime;
    @NotNull(message = "price must be entered")
    @Positive(message = "base price can't be negative")
    private BigDecimal basePrice;
    private UUID pilotID;


}
