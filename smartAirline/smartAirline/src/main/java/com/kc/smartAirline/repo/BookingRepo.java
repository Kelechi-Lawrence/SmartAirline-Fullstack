package com.kc.smartAirline.repo;

import com.kc.smartAirline.entities.Booking;
import com.kc.smartAirline.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BookingRepo extends JpaRepository<Booking, UUID> {
    List< Booking> findByUserIdOrderByIdDesc(UUID userId);
    //won't work as it is uuid , using created at to get around it
    boolean existsByBookingReference(String bookingReference);

    List<Booking> findByUser(User user);

}
