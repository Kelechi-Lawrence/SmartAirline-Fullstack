package com.kc.smartAirline.exceptions;

import org.springframework.web.bind.annotation.ControllerAdvice;

public class BadRequestException extends RuntimeException{

    public BadRequestException(String ex){
        super(ex);

    }
}
