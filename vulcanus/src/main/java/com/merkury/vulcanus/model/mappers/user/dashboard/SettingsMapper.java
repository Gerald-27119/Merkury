package com.merkury.vulcanus.model.mappers.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.settings.UserDataDto;
import com.merkury.vulcanus.model.entities.UserEntity;

public class SettingsMapper {
    private SettingsMapper(){
    }

    public static UserDataDto toDto(UserEntity user){
        return UserDataDto.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .provider(user.getProvider())
                .build();
    }
}
