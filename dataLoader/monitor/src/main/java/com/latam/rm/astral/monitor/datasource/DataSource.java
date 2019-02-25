package com.rm.astral.monitor.transform.datasource;

import org.apache.beam.sdk.io.jdbc.JdbcIO;
import org.apache.beam.sdk.io.jdbc.JdbcIO.DataSourceConfiguration;

import com.rm.astral.monitor.config.MonitorOptions;


public class DataSource {
    public static DataSourceConfiguration getDataSourceConfiguration(MonitorOptions options) {
        return JdbcIO.DataSourceConfiguration.create(options.getJdbcMysql(),getUrl(options));
    }

    private static String getUrl(MonitorOptions options) {
        StringBuilder sb = new StringBuilder();
        sb.append("jdbc:mysql://google/");
        sb.append(options.getDatabaseName());
        sb.append("?cloudSqlInstance=");
        sb.append(options.getInstanceName());
        sb.append("&socketFactory=com.google.cloud.sql.mysql.SocketFactory&user=");
        sb.append(options.getUsername());
        sb.append("&password=");
        sb.append(options.getPassword());
        sb.append("&useUnicode=true&characterEncoding=UTF-8");
        return sb.toString();
    }
}
