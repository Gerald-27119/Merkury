package com.merkury.vulcanus.utils;

import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Component;

import java.util.Set;


@Component
public class JsoupSanitizerConfig {

    private static final Set<String> TAGS_WITH_ALLOWED_STYLE = Set.of(
            "p", "h1", "h2", "h3", "h4", "h5", "h6", "li"
    );

    public Safelist forumPostSafeList() {
        Safelist safelist = Safelist.basic()
                .addTags("u", "a", "img", "video")
                .addAttributes("img", "src", "alt")
                .addAttributes("video", "src", "controls")
                .addEnforcedAttribute("a", "target", "_blank")
                .addEnforcedAttribute("a", "rel", "noopener noreferrer nofollow");

        for (String tag : TAGS_WITH_ALLOWED_STYLE) {
            safelist.addAttributes(tag, "style");
        }

        return safelist;
    }
}
