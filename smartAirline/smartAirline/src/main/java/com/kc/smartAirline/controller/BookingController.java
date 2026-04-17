package com.kc.smartAirline.controller;

import com.kc.smartAirline.dtos.BookingDTO;
import com.kc.smartAirline.dtos.CreateBookingRequest;
import com.kc.smartAirline.dtos.Response;
import com.kc.smartAirline.enums.BookingStatus;
import com.kc.smartAirline.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/booking")
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Response<?>> createBooking(@Valid @RequestBody CreateBookingRequest createBookingRequest){
        return ResponseEntity.ok(bookingService.createBooking(createBookingRequest));

    }
    @GetMapping("/{id}")
    public ResponseEntity<Response<?>> getBookingByID(@PathVariable UUID id){
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }
    @GetMapping("/allBookings")
    @PreAuthorize("hasAnyAuthority('ADMIN','PILOT')")
    public ResponseEntity<Response<List<BookingDTO>>> getAllBooking(){
        return ResponseEntity.ok(bookingService.getAllBooking());
    }
    @GetMapping("/my-bookings")
    @PreAuthorize("hasAuthority('CUSTOMER') or hasAnyAuthority('ADMIN','PILOT')")
    public ResponseEntity<Response<List<BookingDTO>>> getMyBookings(){
        return ResponseEntity.ok(bookingService.getUserBookingHistory());
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('CUSTOMER') or hasAnyAuthority('ADMIN','PILOT')")
    public ResponseEntity<Response<?>> updateStatus(@PathVariable UUID id, @RequestBody BookingStatus bookingstatus){
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, bookingstatus));
    }
}
