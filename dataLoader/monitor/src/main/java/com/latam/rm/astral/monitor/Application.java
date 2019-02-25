package com.latam.rm.astral.monitor;

import com.latam.rm.astral.monitor.config.MonitorOptions;
import com.latam.rm.astral.monitor.transform.MonitorTransform;
import org.apache.beam.sdk.options.PipelineOptionsFactory;

public class Aplication {

    public static void main(String[] args) throws Exception {

        MonitorOptions options = PipelineOptionsFactory.fromArgs(args).withValidation()
                .as(MonitorOptions.class);
        MonitorTransform.Monitor(options);
    }
}
