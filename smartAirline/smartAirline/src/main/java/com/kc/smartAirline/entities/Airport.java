package com.kc.smartAirline.entities;

import com.kc.smartAirline.enums.City;
import com.kc.smartAirline.enums.Country;
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
@Table(name = "Airports")

public class Airport {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Country country;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private City city;
    @Column(nullable = false,unique = true)
    private String iataCode;
}
