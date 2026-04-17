package com.kc.smartAirline.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "email")
public class EmailNotification {
    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    private String subject;
    @Lob //receiving large data
    private String body;
    @NotBlank(message = "recipient mail needed")
    private String recipientMail;
    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking ;
    private LocalDateTime sentAt;
    private Boolean isHtml;
}
