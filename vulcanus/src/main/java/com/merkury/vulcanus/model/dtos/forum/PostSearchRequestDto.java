package com.merkury.vulcanus.model.dtos.forum;

import jakarta.validation.constraints.AssertTrue;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

public record PostSearchRequestDto(
        String searchPhrase,
        String category,
        List<String> tags,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate fromDate,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate toDate,
        String author
) {
    @AssertTrue(message = "fromDate cannot be after toDate")
    public boolean isValidDateRange() {
        if (fromDate == null || toDate == null) return true;
        return !fromDate.isAfter(toDate);
    }
}
