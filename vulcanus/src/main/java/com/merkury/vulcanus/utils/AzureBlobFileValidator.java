package com.merkury.vulcanus.utils;

import com.merkury.vulcanus.exception.exceptions.InvalidFileTypeException;
import com.merkury.vulcanus.model.enums.AllowedFileType;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class AzureBlobFileValidator {

    public void validate(MultipartFile file) throws InvalidFileTypeException {
        validateContentType(file.getContentType());
        validateFileName(file.getOriginalFilename());
    }

    private void validateContentType(String contentType) throws InvalidFileTypeException {
        if (!AllowedFileType.isAllowed(contentType)) {
            throw new InvalidFileTypeException(contentType);
        }
    }

    private void validateFileName(String filename) throws InvalidFileTypeException {
        if (filename == null || !filename.contains(".")) {
            throw new InvalidFileTypeException("File name is missing or has no extension");
        }
    }

}
