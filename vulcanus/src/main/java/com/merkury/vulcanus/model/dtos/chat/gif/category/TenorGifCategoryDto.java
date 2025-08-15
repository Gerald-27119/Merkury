package com.merkury.vulcanus.model.dtos.chat.gif.category;

import lombok.Builder;

import java.io.Serial;
import java.io.Serializable;

@Builder
public record TenorGifCategoryDto(String searchTerm, String path, String gifUrl) implements Serializable{
    @Serial
    private static final long serialVersionUID = 9181184545727856771L;
}
