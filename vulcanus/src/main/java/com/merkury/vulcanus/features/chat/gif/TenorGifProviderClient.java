package com.merkury.vulcanus.features.chat.gif;

import com.merkury.vulcanus.config.properties.GifProviderProperties;
import com.merkury.vulcanus.model.dtos.chat.gif.TenorGifCategoryDto;
import com.merkury.vulcanus.model.dtos.chat.gif.TenorGifCategoryResponse;
import com.merkury.vulcanus.model.mappers.chat.TenorMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * As of 16.07.2025 we are using Tenor as the GIF provider.
 */
@Component
public class TenorGifProviderClient {

    public TenorGifProviderClient(@Qualifier("tenorClient") WebClient webClient,
                                  GifProviderProperties props) {
        this.webClient = webClient;
        this.props = props;
    }

    private final WebClient webClient;
    private final GifProviderProperties props;

    private static final String locale = "pl_PL";
    private static final String country = "PL";
    private static final int limit = 10;


    public Mono<List<TenorGifCategoryDto>> getTrendingCategories() {
        return webClient.get()
                .uri(uri -> uri
                        .path("/categories")
                        .queryParam("key", props.getApiKey())
                        .queryParam("locale", TenorGifProviderClient.locale)
                        .build())
                .retrieve()
                .bodyToMono(TenorGifCategoryResponse.class)
                .map(TenorMapper::mapToGifCategoryDtos);
    }
}


//TODO: włączyć filtrowanie gifow
//next doslownie moze byc stringiem z literami, to wcale nie musi byc lcizba!
//    public Mono<List<TenorRequestResultDto>> searchGifs(String query, String pos) {
//        return webClient.get()
//                .uri(uri -> uri//ej, skad to uri? config webclienta? ale juz mam? inna opcja na robienie requesta? czy ta ok?
//                        .path("/search")
//                        .queryParam("q", query)
//                        .queryParam("key", props.getApiKey())

/// /                        .queryParam("locale", languageAndCountry)
//                        .queryParam("limit", 10)
//                        .queryParam("pos", pos)
//                        .build())
//                .retrieve()
//                .bodyToMono(JsonNode.class)
//                .map(this::parseResponse);
//    }
//https://developers.google.com/tenor/guides/endpoints

//    public Mono<List<TenorRequestResultDto>> featuredGifs(String pos) {
//        return webClient.get()
//                .uri(uri -> uri
//                        .path("/featured")
//                        .queryParam("key", props.getApiKey())
//                        .queryParam("limit", 10)
//                        .queryParam("pos", pos)
//                        .build())
//                .retrieve()
//                .bodyToMono(JsonNode.class)
//                .map(this::parseResponse);
//    }
