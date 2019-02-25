package com.latam.rm.astral.strategyDetail.transform.utils;

import org.apache.beam.sdk.Pipeline;
import org.apache.beam.sdk.coders.AvroCoder;
import org.apache.beam.sdk.io.jdbc.JdbcIO;
import org.apache.beam.sdk.values.PCollection;

import com.latam.rm.astral.strategyDetail.bean.InputStrategy;
import com.latam.rm.astral.strategyDetail.config.StrategyDetailOptions;
import com.latam.rm.astral.strategyDetail.datasource.DataSource;
import com.latam.rm.astral.strategyDetail.transform.mapper.StrategyRowMapper;

public class PCollectionConnection {
	
	private static final String QUERY_STRATEGY = "SELECT STTEGY_ID, STTEGY_NMB, STRTYP_NMB, SOURCE_NMB,LEG_CODE FROM STRATEGY JOIN SOURCE ON SOURCE_ID = STTEGY_FK_SOURCE JOIN TYPE ON STRTYP_ID = STTEGY_FK_TYPE JOIN LEG ON LEG_ID = STTEGY_FK_LEG";

    public static PCollection<InputStrategy> getStrategy(Pipeline p, StrategyDetailOptions options) {
        return p.apply("Read Strategy", JdbcIO.<InputStrategy>read()
                .withDataSourceConfiguration(DataSource.getDataSourceConfiguration(options))
                .withQuery(QUERY_STRATEGY)
                .withCoder(AvroCoder.of(InputStrategy.class)) 
                .withRowMapper(new StrategyRowMapper()));
    }
}
