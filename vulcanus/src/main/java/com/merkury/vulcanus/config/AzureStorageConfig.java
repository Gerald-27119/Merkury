package com.merkury.vulcanus.config;

import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AzureStorageConfig {

    @Bean
    public BlobServiceClient blobServiceClient(@Value("${azure.storage.connection-string}") String connectionString){
        return new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();
    }

}
