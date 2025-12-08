package com.merkury.vulcanus.utils.forum;

import org.jsoup.Jsoup;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ForumMediaExtractor {
    public List<String> extractImageUrls(String cleanedHtml) {
        var doc = Jsoup.parseBodyFragment(cleanedHtml);

        return doc.select("img[src]")
                .stream()
                .map(img -> img.attr("src"))
                .toList();
    }

}
