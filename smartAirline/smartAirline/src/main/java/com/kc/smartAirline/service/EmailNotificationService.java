package com.kc.smartAirline.service;

import com.kc.smartAirline.entities.Booking;
import com.kc.smartAirline.entities.User;

public interface EmailNotificationService {

    void sendBookingEmail(Booking booking);
    void sendWelcomeEmail(User user);
}
