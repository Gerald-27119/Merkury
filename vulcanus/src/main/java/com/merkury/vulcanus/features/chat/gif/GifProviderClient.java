package com.merkury.vulcanus.features.chat.gif;

import com.fasterxml.jackson.databind.JsonNode;
import com.merkury.vulcanus.config.properties.GifProviderProperties;
import com.merkury.vulcanus.model.dtos.chat.gif.GifDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.StreamSupport;

/**
 * As of 16.07.2025 we are using Tenor as the GIF provider.
 */
@Component
@RequiredArgsConstructor
public class GifProviderClient {

    private final WebClient webClient;
    private final GifProviderProperties props;

    public Mono<List<GifDto>> searchGifs(String query, int limit) {
        return webClient.get()
                .uri(uri -> uri
                        .path("/search")
                        .queryParam("q", query)
                        .queryParam("key", props.getApiKey())
                        .queryParam("limit", limit)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(this::parseResponse);
    }

    private List<GifDto> parseResponse(JsonNode root) {
        return StreamSupport.stream(root.get("results").spliterator(), false)
                .map(el -> {
                    JsonNode media = el.get("media").get(0);
                    String preview = media.path("tinygif").path("url").asText("");
                    String full = media.path("gif").path("url").asText("");
                    return new GifDto(el.get("id").asText(), preview, full);
                })
                .toList();
    }
}
