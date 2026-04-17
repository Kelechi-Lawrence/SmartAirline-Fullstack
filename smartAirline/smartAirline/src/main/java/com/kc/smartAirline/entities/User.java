package com.kc.smartAirline.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.kc.smartAirline.enums.AuthMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;
    private String name;
    @Column(unique = true)
    private String email;
    private String phoneNumber;
    private String password;
    private boolean emailVerified;

    //For oauth authentication
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AuthMethod authMethod;
    private String providerId;
    //multiple users have different roles and immediately fetch role when creating a user
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles =new ArrayList<>();

    private boolean active;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference // This side WILL be serialized
    private List<Booking> bookings = new ArrayList<>();
    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
