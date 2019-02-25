package com.latam.rm.astral.strategyDetail.bean;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InputStrategy implements Serializable {
	private static final long serialVersionUID = 1L;

	private String sttegyId;
	private String SttegyNmb;
	private String sttegyType;
	private String sttegySource;
	private String sttegyLeg;

}
