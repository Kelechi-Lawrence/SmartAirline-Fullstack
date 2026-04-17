package com.kc.smartAirline.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.kc.smartAirline.enums.PassengerType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "passenger")
public class Passenger {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;
    @ManyToOne
    @JoinColumn(name = "booking_id")
    @JsonBackReference
     private Booking booking;
    private String firstName;
    private String lastName;
    private String passportNumber;
    @Enumerated(EnumType.STRING)
    private PassengerType type;
    private String seatNumber;
    private String specialRequest;

}
