package com.merkury.vulcanus.model.dtos;

import lombok.Builder;

import java.util.Map;

@Builder
public record EmailDto(String receiver, String title, String template, Map<String, Object> variables) {

}
