package com.merkury.vulcanus.exception.exceptions;

import com.merkury.vulcanus.model.enums.user.dashboard.PhotoSortType;

public class UnsupportedPhotoSortTypeException extends Exception {
    public UnsupportedPhotoSortTypeException(PhotoSortType type) {
        super("Unsupported PhotoSortType: " + type);
    }
}
