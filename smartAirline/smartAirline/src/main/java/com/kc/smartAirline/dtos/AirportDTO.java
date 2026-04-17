package com.kc.smartAirline.dtos;

import com.kc.smartAirline.enums.City;
import com.kc.smartAirline.enums.Country;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirportDTO {
    private UUID id;
  @NotBlank(message = "name is required")
    private String name;
@NotNull(message = "country is required")
    private Country country;
    @NotNull(message = "country is required")
    private City city;
    @NotBlank(message = "name is required")
    private String iataCode;

}
