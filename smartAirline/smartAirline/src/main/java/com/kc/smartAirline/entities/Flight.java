package com.kc.smartAirline.entities;

import com.kc.smartAirline.enums.FlightStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "flights")
public class Flight {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;
    @Column(unique = true, nullable = false)
    private String flightNumber;
    @Enumerated(EnumType.STRING)
    private FlightStatus flightStatus;
    @ManyToOne
    @JoinColumn(name = "departure_airport_id")
    private Airport departureAirport;
    @ManyToOne
    @JoinColumn(name = "arrival_airport_id")
    private Airport arrivalAirport;
    private LocalDateTime arrivalTime;
    private LocalDateTime departureTime;
    private BigDecimal basePrice;
    @ManyToOne
    private User assignedPilot;
    @OneToMany(mappedBy = "flight")
    private List<Booking> bookings = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }}
