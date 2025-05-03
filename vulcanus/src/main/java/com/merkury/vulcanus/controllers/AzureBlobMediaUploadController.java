package com.merkury.vulcanus.controllers;

import com.merkury.vulcanus.exception.exceptions.BlobContainerNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidFileTypeException;
import com.merkury.vulcanus.features.azure.AzureBlobService;
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

    @PostMapping("public/upload/media")
    public ResponseEntity<String> uploadMedia(@RequestParam("file") MultipartFile file) throws IOException, InvalidFileTypeException, BlobContainerNotFoundException {
        String url = azureBlobService.upload("forum", file);
        return ResponseEntity.ok(url);
    }
}
