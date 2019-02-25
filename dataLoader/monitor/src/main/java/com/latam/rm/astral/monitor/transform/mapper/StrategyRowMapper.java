package com.latam.rm.astral.strategyDetail.transform.mapper;

import java.sql.ResultSet;

import org.apache.beam.sdk.io.jdbc.JdbcIO.RowMapper;

import com.latam.rm.astral.strategyDetail.bean.InputStrategy;

/**
 * Map database columns to LegRow bean
 * 
 */
public class StrategyRowMapper implements RowMapper<InputStrategy> {

	private static final long serialVersionUID = 1L;

	@Override
	public InputStrategy mapRow(ResultSet resultSet) throws Exception {
		InputStrategy strategy = new InputStrategy();
		strategy.setSttegyId(resultSet.getString("STTEGY_ID"));
		strategy.setSttegyNmb(resultSet.getString("STTEGY_NMB"));
		strategy.setSttegyType(resultSet.getString("STRTYP_NMB"));
		strategy.setSttegySource(resultSet.getString("SOURCE_NMB"));
		strategy.setSttegyLeg(resultSet.getString("LEG_CODE"));
		
		return strategy;
	}

}
