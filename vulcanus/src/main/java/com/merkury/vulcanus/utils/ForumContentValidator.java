package com.merkury.vulcanus.utils;

import com.merkury.vulcanus.exception.exceptions.InvalidForumContentException;
import org.jsoup.Jsoup;
import org.springframework.stereotype.Component;

@Component
public class ForumContentValidator {

    private static final int MIN_CONTENT_LENGTH = 3;
    private static final int MAX_CONTENT_LENGTH = 5000;

    public void validateContentLength(String content) throws InvalidForumContentException {
        var doc = Jsoup.parse(content);
        doc.select("img, video, iframe, object, embed, svg").remove();
        String plainText = doc.text().trim();

        if (plainText.length() < MIN_CONTENT_LENGTH || plainText.length() > MAX_CONTENT_LENGTH) {
            throw new InvalidForumContentException(
                    "Content must be between " + MIN_CONTENT_LENGTH + " and " + MAX_CONTENT_LENGTH + " characters."
            );
        }
    }
}
