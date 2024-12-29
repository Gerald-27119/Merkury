package com.merkury.vulcanus.model.support.classes;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@RequiredArgsConstructor
@Builder
@Getter
public class EmailData {
    private final String receiver;
    private final String title;
    private final String template;
    private final Map<String, Object> variables;
}
