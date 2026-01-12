package com.merkury.vulcanus.model.dtos.chat.gif.search;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class TenorGifSearchResponse {
    private String next;
    private List<TenorSearchedGif> results;

    @Data
    public static class TenorSearchedGif {
        private TenorGifMediaFormats media_formats;

        @Data
        public static class TenorGifMediaFormats {
            private Gif gif;

            @Data
            public static class Gif {
                private String url;
            }

        }
    }
}
