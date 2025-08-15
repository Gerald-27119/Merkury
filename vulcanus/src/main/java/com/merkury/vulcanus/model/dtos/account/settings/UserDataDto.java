package com.merkury.vulcanus.model.dtos.account.settings;

import com.merkury.vulcanus.model.enums.Provider;
import lombok.Builder;

@Builder
public record UserDataDto(String username,
                          String email,
                          Provider provider) {
}
