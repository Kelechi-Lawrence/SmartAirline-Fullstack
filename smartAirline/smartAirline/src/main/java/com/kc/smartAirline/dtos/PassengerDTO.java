package com.kc.smartAirline.dtos;

import com.kc.smartAirline.enums.PassengerType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PassengerDTO {
    private UUID id;
    //client doesn't request for it
//    private BookingDTO booking;
    @NotBlank(message = "First name cant be null")
    private String firstName;
    @NotBlank(message = "Last name cant be null")
    private String lastName;
    private String passportNumber;
     @NotNull(message = "passenger type cant be null")
    private PassengerType type;
    private String seatNumber;
    private String specialRequest;

}
