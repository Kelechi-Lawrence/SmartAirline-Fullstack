package com.kc.smartAirline.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateBookingRequest {
    @NotNull(message = "must be provided")
    private UUID flightId;
    @NotEmpty(message = "At least one passenger must be provided")
    private List<PassengerDTO> passengers = new ArrayList<>();
}
