package com.merkury.vulcanus.exception.exceptions;

import com.merkury.vulcanus.model.enums.user.dashboard.DateSortType;

public class UnsupportedDateSortTypeException extends Exception {
    public UnsupportedDateSortTypeException(DateSortType type) {
        super("Unsupported DateSortType: " + type);
    }
}
