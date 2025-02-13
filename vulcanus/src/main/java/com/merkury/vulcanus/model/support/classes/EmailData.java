package com.merkury.vulcanus.model.support.classes;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Map;

//TODO: Transform to DTO (Record) and move to dtos package
@RequiredArgsConstructor
@Builder
@Getter
public class EmailData {
    private final String receiver;
    private final String title;
    private final String template;
    private final Map<String, Object> variables;
}
