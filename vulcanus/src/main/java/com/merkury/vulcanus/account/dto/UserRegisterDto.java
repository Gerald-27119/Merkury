package com.merkury.vulcanus.account.dto;

import com.merkury.vulcanus.account.user.UserEntity;
import lombok.Builder;
import lombok.Data;


public record UserRegisterDto(String username, String email, String password) {

}
