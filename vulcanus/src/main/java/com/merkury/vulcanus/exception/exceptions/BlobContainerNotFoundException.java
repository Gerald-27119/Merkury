package com.merkury.vulcanus.exception.exceptions;

public class BlobContainerNotFoundException extends Exception{
    public BlobContainerNotFoundException(String container){
        super(String.format("Blob container %s not found", container));
    }
}
