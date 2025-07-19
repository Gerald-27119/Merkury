package com.merkury.vulcanus.controllers.chat;

import com.merkury.vulcanus.features.chat.gif.GifService;
import com.merkury.vulcanus.model.dtos.chat.gif.TenorGifCategoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;

/**
 * As of 16.07.2025 we are using Tenor as the GIF provider.
 */

@RestController
@RequestMapping("gifs")
@RequiredArgsConstructor
public class GifController {

    private final GifService gifService;

    @GetMapping("trending")
    public Mono<ResponseEntity<List<TenorGifCategoryDto>>> getTrendingGifs() {
        return gifService.getTrendingCategories()
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.ok(Collections.emptyList()));
    }

}
