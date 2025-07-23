package com.merkury.vulcanus.features.chat.gif;

import com.merkury.vulcanus.model.dtos.chat.gif.category.TenorGifCategoryDto;
import com.merkury.vulcanus.model.dtos.chat.gif.search.TenorGifSearchWrapperDto;
import com.merkury.vulcanus.model.mappers.chat.TenorMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GifService {

    private final TenorGifProviderClient client;

    //    TODO:move obecjts mapping here
    @Cacheable(cacheNames = "gifsTrendingTerms", sync = true)
    public Mono<List<TenorGifCategoryDto>> getTrendingCategories() {
        return client.getTrendingCategories();
    }

//    TODO:add caching
    public Mono<TenorGifSearchWrapperDto> searchGifsBySearchPhrase(String searchPhrase, String next) {
        return client.searchGifsBySearchPhrase(searchPhrase, next)
                .map(TenorMapper::mapToSearchWrapper);
    }
}
