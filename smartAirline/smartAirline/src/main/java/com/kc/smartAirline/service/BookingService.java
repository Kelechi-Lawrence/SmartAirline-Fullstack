package com.kc.smartAirline.service;

import com.kc.smartAirline.dtos.BookingDTO;
import com.kc.smartAirline.dtos.CreateBookingRequest;
import com.kc.smartAirline.dtos.Response;
import com.kc.smartAirline.enums.BookingStatus;

import java.util.List;
import java.util.UUID;

public interface BookingService {
    Response<?> createBooking(CreateBookingRequest createBookingRequest);
    Response<?> getBookingById(UUID id);
    Response<List<BookingDTO>>getAllBooking();
    Response<?> updateBookingStatus(UUID id, BookingStatus bookingStatus);
    Response<List<BookingDTO>> getUserBookingHistory();


}
