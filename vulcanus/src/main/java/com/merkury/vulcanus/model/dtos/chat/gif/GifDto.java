package com.merkury.vulcanus.model.dtos.chat.gif;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GifDto {
    private String id;
    private String previewUrl;
    private String gifUrl;
}

