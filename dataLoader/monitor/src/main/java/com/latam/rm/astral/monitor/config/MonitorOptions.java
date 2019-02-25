package com.rm.astral.monitor.config;

import org.apache.beam.sdk.options.Default;
import org.apache.beam.sdk.options.Description;
import org.apache.beam.sdk.options.PipelineOptions;
import org.apache.beam.sdk.options.Validation.Required;

public interface MonitorOptions extends PipelineOptions {

    @Description("JDBC Mysql")
    @Default.String("com.mysql.jdbc.Driver")
    String getJdbcMysql();
    void setJdbcMysql(String value);

    @Description("Database Name ODS")
    @Required
    String getDatabaseName();
    void setDatabaseName(String value);

    @Description("Instance Name")
    @Required
    String getInstanceName();
    void setInstanceName(String value);

    @Description("Nombre Usuario MYSQL")
    @Required
    String getUsername();
    void setUsername(String value);

    @Description("Contraseña MYSQL")
    @Required
    String getPassword();
    void setPassword(String value);

}
