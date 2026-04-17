package com.kc.smartAirline.enums;

import lombok.Getter;

@Getter
public enum City {
    //Nigeria
    LAGOS(Country.NIGERIA),
    ABUJA (Country.NIGERIA),

    //America
    MIAMI (Country.USA),
    DALLAS (Country.USA),

    //UK
    LEED (Country.UK),
    LONDON (Country.UK);

    private Country country;
   City(Country country){
       this.country = country;
   }
}
