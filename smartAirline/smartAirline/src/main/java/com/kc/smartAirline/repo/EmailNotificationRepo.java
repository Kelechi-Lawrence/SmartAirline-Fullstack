package com.kc.smartAirline.repo;

import com.kc.smartAirline.entities.EmailNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EmailNotificationRepo extends JpaRepository<EmailNotification, UUID> {
}
