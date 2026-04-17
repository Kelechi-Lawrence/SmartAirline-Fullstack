package com.kc.smartAirline.service.impl;

import com.kc.smartAirline.entities.Booking;
import com.kc.smartAirline.entities.EmailNotification;
import com.kc.smartAirline.entities.User;
import com.kc.smartAirline.repo.EmailNotificationRepo;
import com.kc.smartAirline.service.EmailNotificationService;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor

public class EmailNotificationServiceImpli implements EmailNotificationService {

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;
    private final EmailNotificationRepo emailNotificationRepo;
    @Value("${bookingUrl}")
    private String bookingUrl;
    @Value("${loginUrl}")
    private String loginUrl;
    @Override
    @Transactional
    @Async

    public void sendBookingEmail(Booking booking) {
        log.info("inside sendBookingEmail()");
        String recipientEmail = booking.getUser().getEmail();
        String subject = "Your Flight Booking ticket -Reference";
        String templateName = "booking_ticket";
        Map<String, Object> templateVariables = new HashMap<>();
        templateVariables.put("userName", booking.getUser().getName());

        templateVariables.put("bookingReference", booking.getBookingReference());
        templateVariables.put("flightNumber", booking.getFlight().getFlightNumber());

        templateVariables.put(
                "departureAirportIataCode",
                booking.getFlight().getDepartureAirport().getIataCode()
        );
        templateVariables.put(
                "departureAirportName",
                booking.getFlight().getDepartureAirport().getName()
        );
        templateVariables.put(
                "departureAirportCity",
                booking.getFlight().getDepartureAirport().getCity()
        );
        templateVariables.put(
                "departureTime",
                booking.getFlight().getDepartureTime()
        );

        templateVariables.put(
                "arrivalAirportIataCode",
                booking.getFlight().getArrivalAirport().getIataCode()
        );
        templateVariables.put(
                "arrivalAirportName",
                booking.getFlight().getArrivalAirport().getName()
        );
        templateVariables.put(
                "arrivalAirportCity",
                booking.getFlight().getArrivalAirport().getCity()
        );
        templateVariables.put(
                "arrivalTime",
                booking.getFlight().getArrivalTime()
        );

        templateVariables.put(
                "basePrice",
                booking.getFlight().getBasePrice()
        );

        templateVariables.put(
                "passengers",
                booking.getPassengers()
        );

        templateVariables.put(
                "bookingUrl",bookingUrl

        );
        templateVariables.put(
                "loginUrl",loginUrl

        );
//render the template context
        Context context = new Context();
        templateVariables.forEach(context::setVariable);
        String emailBody = templateEngine.process(templateName, context);
        //send email
        sendMailOut(recipientEmail, subject, emailBody,true, booking);
    }

    @Override
    @Transactional
    @Async
    public void sendWelcomeEmail(User user) {
       log.info("Sending welcome message sendWelcomeEmail()");
       String recipientEmail = user.getEmail();
       String subject = "Welcome to smartAirline✈️";
       String templateName = "welcome";

        Map<String, Object> variables = new HashMap<>();
        variables.put("userName", user.getName());
        variables.put("loginUrl", loginUrl);

        // Render template
        Context context = new Context();
        variables.forEach(context::setVariable);
        String emailBody = templateEngine.process(templateName, context);

        // Send & persist email (NO booking)
        sendMailOut(recipientEmail, subject, emailBody, true, null);

    }
    public void sendMailOut(
            String recipientEmail,
            String subject,
            String body,
            boolean isHtml,
            Booking booking
    ) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setTo(recipientEmail);
            helper.setSubject(subject);
            helper.setText(body, isHtml);

            javaMailSender.send(mimeMessage);

            log.info("Email sent successfully!");
        } catch (Exception ex) {
            log.error("Failed to send email", ex);
        }
        EmailNotification emailNotification = new EmailNotification();
        emailNotification.setRecipientMail(recipientEmail);
        emailNotification.setSubject(subject);
        emailNotification.setBody(body);
        emailNotification.setIsHtml(isHtml);
        emailNotification.setSentAt(LocalDateTime.now());
        emailNotification.setBooking(booking);

        emailNotificationRepo.save(emailNotification);
    }

}
