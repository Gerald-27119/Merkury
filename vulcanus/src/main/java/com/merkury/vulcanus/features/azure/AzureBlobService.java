package com.merkury.vulcanus.features.azure;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.batch.BlobBatch;
import com.azure.storage.blob.batch.BlobBatchClient;
import com.azure.storage.blob.batch.BlobBatchClientBuilder;
import com.azure.storage.blob.models.BlobStorageException;
import com.merkury.vulcanus.exception.exceptions.BlobContainerNotFoundException;
import com.merkury.vulcanus.exception.exceptions.FileUploadFailedException;
import com.merkury.vulcanus.exception.exceptions.InvalidFileTypeException;
import com.merkury.vulcanus.model.enums.AzureBlobFileValidatorType;
import com.merkury.vulcanus.utils.AzureBlobFileValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AzureBlobService {

    private final BlobServiceClient blobServiceClient;
    private final AzureBlobFileValidator fileValidator;

    public String upload(String containerName, MultipartFile file, AzureBlobFileValidatorType azureBlobFileValidatorType) throws IOException, InvalidFileTypeException, BlobContainerNotFoundException {
        fileValidator.validate(file, azureBlobFileValidatorType);
        BlobContainerClient blobContainerClient = blobServiceClient.getBlobContainerClient(containerName);

        validateContainerName(blobContainerClient, containerName);
        BlobClient blobClient = blobContainerClient.getBlobClient(changeFileName(Objects.requireNonNull(file.getOriginalFilename())));

        try {
            blobClient.upload(file.getInputStream(), file.getSize(), true);
        } catch (BlobStorageException ex) {
            log.error("File upload to blob failed: {}", ex.getServiceMessage());
            throw new FileUploadFailedException(ex);
        }

        return blobClient.getBlobUrl();
    }

    public void delete(String containerName, String fileUrl) throws BlobContainerNotFoundException, URISyntaxException {
        BlobContainerClient blobContainerClient = blobServiceClient.getBlobContainerClient(containerName);
        validateContainerName(blobContainerClient, containerName);

        var blobName = Paths.get(new URI(fileUrl).getPath()).getFileName().toString();
        BlobClient blobClient = blobContainerClient.getBlobClient(blobName);
        if (Boolean.TRUE.equals(blobClient.exists())) {
            blobClient.delete();
        }
    }

    public void deleteBatch(String containerName, List<String> fileUrls) throws BlobContainerNotFoundException, URISyntaxException {
        BlobContainerClient blobContainerClient = blobServiceClient.getBlobContainerClient(containerName);
        validateContainerName(blobContainerClient, containerName);

        BlobBatchClient blobBatchClient = new BlobBatchClientBuilder(blobServiceClient).buildClient();

        // Azure Blob batch supports max 256 subrequests and total body size up to 4 MB per batch
        int batchSize = 256;
        for (int i = 0; i < fileUrls.size(); i += batchSize) {
            List<String> batch = fileUrls.subList(i, Math.min(i + batchSize, fileUrls.size()));
            BlobBatch blobBatch = blobBatchClient.getBlobBatch();

            for (String fileUrl : batch) {
                String blobName = Paths.get(new URI(fileUrl).getPath()).getFileName().toString();
                blobBatch.deleteBlob(containerName, blobName);
            }

            blobBatchClient.submitBatch(blobBatch);
        }
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
