package com.merkury.vulcanus.observability.counter.invocations;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Counter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class InvocationsCounterService {

    private final MeterRegistry meterRegistry;
    private final ConcurrentHashMap<String, Counter> counters = new ConcurrentHashMap<>();

    public void increment(String methodName) {
        counters.computeIfAbsent(methodName, name ->
                Counter.builder("controller.invocations")
                        .tag("method", name)
                        .description("Counts the number of invocations of controller methods")
                        .register(meterRegistry)
        ).increment();
    }
}

