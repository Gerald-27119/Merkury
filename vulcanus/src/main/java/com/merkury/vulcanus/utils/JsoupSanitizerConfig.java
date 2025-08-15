package com.merkury.vulcanus.utils;

import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Component;

@Component
public class JsoupSanitizerConfig {

    public Safelist forumPostSafeList() {
        return Safelist.basic()
                .addTags("u", "a", "h1", "h2", "h3", "h4", "h5", "h6", "img", "video")
                .addAttributes("img", "src", "alt")
                .addAttributes(":all", "style")
                .addEnforcedAttribute("a", "target", "_blank")
                .addEnforcedAttribute("a", "rel", "noopener noreferrer nofollow");
    }
}
