package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.BlobContainerNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidFileTypeException;
import com.merkury.vulcanus.features.azure.AzureBlobService;
import com.merkury.vulcanus.model.enums.AzureBlobFileValidatorType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class AzureBlobMediaUploadController {

    private final AzureBlobService azureBlobService;

    @PostMapping("/public/upload/media")
    public ResponseEntity<String> uploadMedia(@RequestParam("file") MultipartFile file, @RequestParam String containerName) throws IOException, InvalidFileTypeException, BlobContainerNotFoundException {
        String url = azureBlobService.upload(containerName, file, AzureBlobFileValidatorType.DEFAULT);
        return ResponseEntity.ok(url);
    }
}
