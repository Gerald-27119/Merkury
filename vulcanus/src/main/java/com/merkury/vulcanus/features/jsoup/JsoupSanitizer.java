package com.merkury.vulcanus.features.jsoup;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.safety.Cleaner;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class JsoupSanitizer {

    private static final Set<String> ALLOWED_STYLES = Set.of(
            "text-align", "color"
    );
    private static final Set<String> ALLOWED_TEXT_ALIGN_VALUES = Set.of("left", "center", "right", "justify");
    private static final Set<String> ALLOWED_COLOR_VALUES = Set.of("#dc2626", "#2563eb", "#7c3aed");


    public String clean(String content, Safelist safelist) {
        Cleaner cleaner = new Cleaner(safelist);
        Document dirty = Jsoup.parseBodyFragment(content);
        Document clean = cleaner.clean(dirty);

        for (Element el : clean.select("*[style]")) {
            String style = el.attr("style");
            StringBuilder newStyle = new StringBuilder();

            for (String rule : style.split(";")) {
                rule = rule.trim();
                if (rule.isEmpty()) continue;

                String[] parts = rule.split(":", 2);
                if (parts.length != 2) continue;

                String property = parts[0].trim();
                String value = parts[1].trim();

                if (!ALLOWED_STYLES.contains(property)) continue;
                String validatedValue = validateStyleValue(property, value);
                if (validatedValue != null) {
                    newStyle.append(property).append(":").append(validatedValue).append("; ");
                }
            }

            if (!newStyle.isEmpty()) {
                el.attr("style", newStyle.toString().trim());
            } else {
                el.removeAttr("style");
            }
        }

        return clean.body().html();
    }

    private String validateStyleValue(String property, String value) {
        return switch (property) {
            case "text-align" -> ALLOWED_TEXT_ALIGN_VALUES.contains(value) ? value : null;
            case "color" -> ALLOWED_COLOR_VALUES.contains(value) ? value : null;
            default -> null;
        };
    }

}
