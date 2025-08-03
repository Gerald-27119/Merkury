package com.merkury.vulcanus.model.dtos.chat.gif.category;

import lombok.Data;

import java.util.List;

@Data
public class TenorGifCategoryResponse {
    private String locale;
    private List<TenorGifTag> tags;

    @Data
    public static class TenorGifTag {
        private String searchterm;
        private String path;
        private String image;
        private String name;
    }
}
