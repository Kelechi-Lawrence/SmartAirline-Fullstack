package com.kc.smartAirline.dtos;

import com.kc.smartAirline.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDTO
{
    private UUID id;

    private String bookingReference;

    private FlightDTO flight;

    private UserDTO user;

    private BookingStatus status;

    private List<PassengerDTO> passengers ;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
