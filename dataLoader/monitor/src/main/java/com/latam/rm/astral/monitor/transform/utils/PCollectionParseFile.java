package com.latam.rm.astral.strategyDetail.transform.utils;

import org.apache.beam.sdk.transforms.DoFn;
import org.apache.beam.sdk.transforms.ParDo;
import org.apache.beam.sdk.values.PCollection;

import com.latam.rm.astral.strategyDetail.bean.OutputResultStrategyDetail;
import com.latam.rm.astral.strategyDetail.bean.ResultRowStrategyDetail;
import com.latam.rm.astral.strategyDetail.bean.StrategiesFileRow;

public class PCollectionParseFile {

	public static DoFn<String, StrategiesFileRow> parseStrategies() {
		return new DoFn<String, StrategiesFileRow>() {
			private static final long serialVersionUID = 1L;

			@ProcessElement
			public void processElement(ProcessContext c) {
				StrategiesFileRow inputFlight = extractStrategies(c.element());
				c.output(inputFlight);
			}
		};
	}

	private static StrategiesFileRow extractStrategies(String input) {
		String[] i = input.split(",");
		StrategiesFileRow in = new StrategiesFileRow();
		in.setStrTypNmb(i[0]);
		in.setSourceNmb(i[1]);
		in.setGeographyLvl(i[2]);
		in.setOriginLeg(i[3]);
		in.setDestinationLeg(i[4]);
		in.setSttegyNmb(i[5]);
		in.setMaterialType(i[6]);
		in.setApMax(i[7]);
		in.setApMin(i[8]);
		in.setStydtlNmr(i[9]);
		in.setStydtlVlr(i[10]);

		return in;
	}

	public static PCollection<OutputResultStrategyDetail> convertOutputStrategy(
			PCollection<ResultRowStrategyDetail> inputStrategies) {
		return inputStrategies.apply("Convert Output Strategy", ParDo.of(convertStrategy()));
	}

	public static DoFn<ResultRowStrategyDetail, OutputResultStrategyDetail> convertStrategy() {
		return parseStrategy();
	}

	public static DoFn<ResultRowStrategyDetail, OutputResultStrategyDetail> parseStrategy() {
		return new DoFn<ResultRowStrategyDetail, OutputResultStrategyDetail>() {
			private static final long serialVersionUID = 1L;

			@ProcessElement
			public void processElement(ProcessContext c) {
				ResultRowStrategyDetail in = new ResultRowStrategyDetail();
				OutputResultStrategyDetail o = new OutputResultStrategyDetail();
				in = c.element();
				o.setStydtlNmr(in.getStrategies().getStydtlNmr());
				o.setStydtlVlr(in.getStrategies().getStydtlVlr());
				o.setStydtlFkApGroup("1");
				o.setStydtlFkStrategy(in.getStrategy().getSttegyId());
				o.setStydtlAp(in.getStrategies().getApMax() + "-" + in.getStrategies().getApMin());
				c.output(o);
			}
		};
	}
}
