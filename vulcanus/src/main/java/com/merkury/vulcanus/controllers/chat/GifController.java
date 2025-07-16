package com.merkury.vulcanus.controllers.chat;

import com.merkury.vulcanus.features.chat.gif.GifService;
import com.merkury.vulcanus.model.dtos.chat.gif.GifDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * As of 16.07.2025 we are using Tenor as the GIF provider.
 */

@RestController
@RequestMapping("gifs")
@RequiredArgsConstructor
public class GifController {

    private final GifService gifService;


    @GetMapping("/search")
    public Mono<ResponseEntity<List<GifDto>>> search(@RequestParam("q") String query) {
        return gifService.search(query)
                .map(list ->
                        list.isEmpty()
                                ? ResponseEntity.noContent().build()
                                : ResponseEntity.ok(list)
                );
    }

    //trending
    //other endpoints
}
