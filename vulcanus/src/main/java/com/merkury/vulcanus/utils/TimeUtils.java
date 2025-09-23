package com.merkury.vulcanus.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TimeUtils {
    private TimeUtils() {}

    /**
     * Returns current time with minutes set to zero, optionally adding days,
     * in ISO-8601 format up to minutes, e.g. "2025-09-23T14:00".
     *
     * @param daysToAdd number of days to add (can be negative or zero)
     * @return formatted date-time string
     */
    public static String getISO8601Time(int daysToAdd) {
        var now = LocalDateTime.now();

        now = now.withMinute(0)
                .withSecond(0)
                .withNano(0);

        if (daysToAdd != 0) {
            now = now.plusDays(daysToAdd);
        }

        var formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

        return now.format(formatter);
    }
}
