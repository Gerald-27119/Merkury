package com.merkury.vulcanus.features.chat.gif;

import com.merkury.vulcanus.config.properties.GifProviderProperties;
import com.merkury.vulcanus.model.dtos.chat.gif.category.TenorGifCategoryDto;
import com.merkury.vulcanus.model.dtos.chat.gif.category.TenorGifCategoryResponse;
import com.merkury.vulcanus.model.dtos.chat.gif.search.TenorGifSearchResponse;
import com.merkury.vulcanus.model.mappers.chat.TenorMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
//TODO:
//1. właczyc filtrowanie po przeznaczeniu wiekowym tresci
//2. zbierac loakzliacje od usera
//3. unikalne id usera do wyszukiwania
//4. raportowanie do tenor o wyszukiwanych frazach

/**
 * As of 16.07.2025 we are using Tenor as the GIF provider.
 */
@Component
class TenorGifProviderClient {

    public TenorGifProviderClient(@Qualifier("tenorClient") WebClient webClient,
                                  GifProviderProperties props) {
        this.webClient = webClient;
        this.props = props;
    }

    private final WebClient webClient;
    private final GifProviderProperties props;

    private static final String locale = "pl_PL";
    //    private static final String country = "PL"; dev purpose only
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

    public Mono<TenorGifSearchResponse> searchGifsBySearchPhrase(String searchPhrase, String next) {

        return webClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder
                            .path("/search")
                            .queryParam("key", props.getApiKey())
                            .queryParam("locale", TenorGifProviderClient.locale)
                            .queryParam("q", searchPhrase)
                            .queryParam("media_filter", "gif")
                            .queryParam("limit", limit);

                    if (next != null && !next.isBlank()) {
                        builder = builder.queryParam("pos", next);
                    }

                    return builder.build();
                })
                .retrieve()
                .bodyToMono(TenorGifSearchResponse.class);
    }

}
