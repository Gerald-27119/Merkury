package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.mappers.user.dashboard.ProfileMapper;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserEntityFetcher userEntityFetcher;

    public UserProfileDto getUserProfile(String username) throws UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(username);
//        var isFriends = false;
//        var isFollowing = false;
//
//        if(!anotherUsername.equals("undefiend")){
//            var anotherUser = userEntityFetcher.getByUsername(anotherUsername);
//            isFriends = getIsUsersFriends(user, anotherUser);
//            isFollowing = getIsUsersFollowing(user, anotherUser);
//        }

        var images = user.getImages().stream()
                .sorted(Comparator.comparingInt(Img::getLikes).reversed())
                .limit(4)
                .map(ProfileMapper::toDto)
                .toList();
        return ProfileMapper.toDto(user, images,false , false);
    }

    private Boolean getIsUsersFriends(UserEntity user, UserEntity secondUser){
        return user.getFriendships().stream().anyMatch(f -> f.getFriend().equals(secondUser));
    }

    private Boolean getIsUsersFollowing(UserEntity user, UserEntity secondUser){
        return user.getFollowed().stream().anyMatch(f -> f.equals(secondUser));
    }
}
