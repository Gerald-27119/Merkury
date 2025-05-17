package com.merkury.vulcanus.features.azure;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.BlobStorageException;
import com.merkury.vulcanus.exception.exceptions.BlobContainerNotFoundException;
import com.merkury.vulcanus.exception.exceptions.FileUploadFailedException;
import com.merkury.vulcanus.exception.exceptions.InvalidFileTypeException;
import com.merkury.vulcanus.utils.AzureBlobFileValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AzureBlobService {

    private final BlobServiceClient blobServiceClient;
    private final AzureBlobFileValidator fileValidator;

    public String upload(String containerName, MultipartFile file) throws IOException, InvalidFileTypeException, BlobContainerNotFoundException {

        fileValidator.validate(file);
        BlobContainerClient blobContainerClient = blobServiceClient.getBlobContainerClient(containerName);

        validateContainerName(blobContainerClient, containerName);
        BlobClient blobClient = blobContainerClient.getBlobClient(changeFileName(file.getOriginalFilename()));

        try {
            blobClient.upload(file.getInputStream(), file.getSize(), true);
        } catch (BlobStorageException ex) {
            throw new FileUploadFailedException(ex);
        }

        return blobClient.getBlobUrl();
    }

    private String changeFileName(String originalFileName) {
       return UUID.randomUUID() + originalFileName.substring(originalFileName.lastIndexOf("."));
    }

    private void validateContainerName(BlobContainerClient blobContainerClient, String containerName) throws BlobContainerNotFoundException {
        if (!blobContainerClient.exists()) {
            throw new BlobContainerNotFoundException(containerName);
        }
    }
}
