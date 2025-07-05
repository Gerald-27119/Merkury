package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UnsupportedDateSortTypeException;
import com.merkury.vulcanus.model.enums.user.dashboard.DateSortType;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.function.Function;


public abstract class GroupedDataService {

    protected <T> Comparator<T> comparingDate(Function<T, LocalDate> dateExtractor, DateSortType type) throws UnsupportedDateSortTypeException {
        return Comparator.comparing(dateExtractor, getDateComparator(type));
    }

    protected boolean isInDateRange(LocalDate date, LocalDate from, LocalDate to) {
        return (from == null || !date.isBefore(from)) && (to == null || !date.isAfter(to));
    }

    private Comparator<LocalDate> getDateComparator(DateSortType type) throws UnsupportedDateSortTypeException {
        return switch (type) {
            case DATE_INCREASE -> Comparator.naturalOrder();
            case DATE_DECREASE -> Comparator.reverseOrder();
            default -> throw new UnsupportedDateSortTypeException(type);
        };
    }
}
