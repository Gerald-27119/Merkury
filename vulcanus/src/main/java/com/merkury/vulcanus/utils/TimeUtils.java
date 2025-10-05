package com.merkury.vulcanus.utils;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class TimeUtils {
    private TimeUtils() {}

    public static String getISO8601Time(int daysToAdd, String zoneId) {

        ZoneId zone = ZoneId.of(zoneId);

        Instant now = Instant.now();
        ZonedDateTime local = now.atZone(zone);
        local = local
                .withMinute(0)
                .withSecond(0)
                .withNano(0);

        if (daysToAdd > 0) {
            local = local.plusDays(daysToAdd);
        }
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
        return local.format(fmt);
    }
}
