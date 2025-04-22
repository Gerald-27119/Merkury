package com.merkury.vulcanus.features.account;

import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.mappers.ProfileMapper;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserEntityRepository userEntityRepository;

    public UserProfileDto getUserProfileDto(String username){
        var user = userEntityRepository.findByUsername(username).orElseThrow();
        var images = user.getImages().stream()
                .sorted(Comparator.comparingInt(Img::getLikes))
                .limit(4)
                .map(ProfileMapper::toDto)
                .toList();
        return ProfileMapper.toDto(user, images);
    }
}
