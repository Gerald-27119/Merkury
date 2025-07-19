package com.merkury.vulcanus.features.chat.gif;

import com.merkury.vulcanus.model.dtos.chat.gif.TenorGifCategoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GifService {

    private final TenorGifProviderClient client;

    @Cacheable(cacheNames = "gifsTrendingTerms", sync = true)
    public Mono<List<TenorGifCategoryDto>> getTrendingCategories() {
        return client.getTrendingCategories();
    }
}
