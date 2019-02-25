package com.latam.rm.astral.monitor.bean;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InputMonitor implements Serializable {

    private static final long serialVersionUID = 1L;

    private String carrierCd;
    private String flightNum;
    private String originLeg;
    private String destinationLeg;
    private String flightDate;
    private String cabinCd;
    private String estrategyType;
    private String estrategyName;
    private String estrategySource;
}
