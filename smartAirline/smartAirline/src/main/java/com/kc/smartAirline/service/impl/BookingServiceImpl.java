package com.kc.smartAirline.service.impl;

import com.kc.smartAirline.dtos.*;
import com.kc.smartAirline.entities.Booking;
import com.kc.smartAirline.entities.Flight;
import com.kc.smartAirline.entities.Passenger;
import com.kc.smartAirline.entities.User;
import com.kc.smartAirline.enums.BookingStatus;
import com.kc.smartAirline.enums.FlightStatus;
import com.kc.smartAirline.exceptions.BadRequestException;
import com.kc.smartAirline.exceptions.NotFoundException;
import com.kc.smartAirline.repo.*;
import com.kc.smartAirline.service.BookingService;
import com.kc.smartAirline.service.EmailNotificationService;
import com.kc.smartAirline.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static java.util.stream.DoubleStream.builder;
import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final UserService userService;
    private final ModelMapper modelMapper;
    private final PassengerRepo passengerRepo;
    private final BookingRepo bookingRepo;
    private final FlightRepo flightRepo;
    private final EmailNotificationService emailNotificationService;

    @Override
    public Response<?> createBooking(CreateBookingRequest createBookingRequest) {
        log.info("flightId = {}", createBookingRequest.getFlightId());
        User user = userService.currentUser();
        Flight flight = flightRepo.findById(createBookingRequest.getFlightId())
            .orElseThrow(()-> new NotFoundException("particular flight doesnt exist"));
        if(flight.getFlightStatus() != FlightStatus.SCHEDULED){
            throw new BadRequestException("not possible, there must be a flight scheduled for you to even book it at all");
        }
        Booking booking = new Booking();
        booking.setBookingReference(generateBookingReference());
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setFlight(flight);
        booking.setUser(user);
        booking.setBookingDate(LocalDateTime.now());

        Booking savedBooking = bookingRepo.save(booking);
        if (createBookingRequest.getPassengers() != null
                && !createBookingRequest.getPassengers().isEmpty()) {
           //getting the passenger to save
            List<Passenger> passengers = createBookingRequest.getPassengers()
                    .stream()
                    .map(passengerDTO -> modelMapper.map(passengerDTO, Passenger.class))
                    .toList();

            passengers.forEach(passenger -> passenger.setBooking(booking));

            passengerRepo.saveAll(passengers);
            savedBooking.setPassengers(passengers);
            emailNotificationService.sendBookingEmail(savedBooking);
        }
      return Response.builder()
              .statusCode(HttpStatus.OK.value())
              .message("Booking created sucessfully")
        .build();
    }


    @Override
    public Response<?> getBookingById(UUID id) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(()-> new NotFoundException("Booking not found"));
        BookingDTO bookingDTO = modelMapper.map(booking, BookingDTO.class);
        if (bookingDTO.getFlight() != null) {
            bookingDTO.getFlight().setBookings(null); // prevents Flight from mapping all bookings again
        }

        return Response.<BookingDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .data(bookingDTO)
                .message("Booking retrieved sucessfully")
                .build();
    }

    @Override
    public Response<List<BookingDTO>> getAllBooking() {
        Sort sortByDec = Sort.by(Sort.Direction.DESC, "createdAt");

        List<BookingDTO> bookingDTOS = bookingRepo.findAll(sortByDec)
                .stream()
                .map(booking -> {
                    BookingDTO bookingDTO = modelMapper.map(booking, BookingDTO.class);
                    // Prevent recursive loop
                    if (bookingDTO.getFlight() != null) {
                        bookingDTO.getFlight().setBookings(null);
                    }
                    return bookingDTO;
                })
                .toList();

        return Response.<List<BookingDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message(bookingDTOS.isEmpty() ? "Booking not found" : "Bookings retrieved successfully")
                .data(bookingDTOS)
                .build();
    }
    @Override
    public Response<List<BookingDTO>> getUserBookingHistory() {

        User user = userService.currentUser();


        List<Booking> bookings = bookingRepo.findByUser(user);

       
        List<BookingDTO> bookingDTOList = bookings.stream()
                .map(booking -> {
                    BookingDTO dto = modelMapper.map(booking, BookingDTO.class);
                    if (dto.getFlight() != null) {
                        dto.getFlight().setBookings(null); // Stop recursion
                    }
                    return dto;
                })
                .toList();

        return Response.<List<BookingDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message(bookingDTOList.isEmpty() ? "No bookings found for this user" : "User bookings retrieved")
                .data(bookingDTOList)
                .build();
    }
    @Override
    public Response<?> updateBookingStatus(UUID id, BookingStatus bookingStatus) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(()->new NotFoundException("Not found"));
        booking.setStatus(bookingStatus);
        bookingRepo.save(booking);
        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("updated status sucessfully")
                .build();
    }
    private String generateBookingReference() {
        String reference;

        do {
            reference = UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 8)
                    .toUpperCase();
        } while (bookingRepo.existsByBookingReference(reference));

        return reference;
    }

}
