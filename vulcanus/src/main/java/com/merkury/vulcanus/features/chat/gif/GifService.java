package com.merkury.vulcanus.features.chat.gif;

import com.merkury.vulcanus.model.dtos.chat.gif.GifDto;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GifService {

    private final GifProviderClient client;

    @Cacheable(value = "gifSearch", key = "#query", unless = "#result == null || #result.block().isEmpty()")
    public Mono<List<GifDto>> search(String query) {
        return client.searchGifs(query, 20);
    }
}


