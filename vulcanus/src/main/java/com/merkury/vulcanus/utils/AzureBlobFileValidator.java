package com.merkury.vulcanus.utils;

import com.merkury.vulcanus.exception.exceptions.InvalidFileTypeException;
import com.merkury.vulcanus.model.enums.AllowedFileType;
import com.merkury.vulcanus.model.enums.AzureBlobFileValidatorType;
import com.merkury.vulcanus.model.enums.chat.ChatMessageAttachedFileType;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class AzureBlobFileValidator {

    public void validate(MultipartFile file, AzureBlobFileValidatorType type) throws InvalidFileTypeException {
        final String contentType = file.getContentType();
        switch (type) {
            case DEFAULT -> validateContentTypeDefault(contentType);
            case CHAT -> validateContentTypeChat(contentType);
            default -> validateContentTypeDefault(contentType);
        }
        validateFileName(file.getOriginalFilename());
    }

    private void validateFileName(String filename) throws InvalidFileTypeException {
        if (filename == null || !filename.contains(".")) {
            throw new InvalidFileTypeException("File name is missing or has no extension");
        }
    }

    private void validateContentTypeDefault(String contentType) throws InvalidFileTypeException {
        if (AllowedFileType.isInvalid(contentType)) {
            throw new InvalidFileTypeException(contentType);
        }
    }

    private void validateContentTypeChat(String contentType) throws InvalidFileTypeException {
        if (ChatMessageAttachedFileType.isInvalid(contentType)) {
            throw new InvalidFileTypeException(contentType);
        }
    }

}
