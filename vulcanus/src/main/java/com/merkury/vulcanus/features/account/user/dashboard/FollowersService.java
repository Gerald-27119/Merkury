package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UserAlreadyFollowedException;
import com.merkury.vulcanus.exception.exceptions.UserNotFollowedException;
import com.merkury.vulcanus.exception.exceptions.UnsupportedEditUserFriendsTypeException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.social.SocialDto;
import com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType;
import com.merkury.vulcanus.model.mappers.user.dashboard.SocialMapper;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowersService {
    private final UserEntityRepository userEntityRepository;
    private final UserEntityFetcher userEntityFetcher;

    public List<SocialDto> getUserFollowers(String username) throws UserNotFoundByUsernameException {
        return userEntityFetcher.getByUsername(username)
                .getFollowers()
                .stream()
                .map(SocialMapper::toDto)
                .toList();
    }

    public List<SocialDto> getUserFollowed(String username) throws UserNotFoundByUsernameException {
        return userEntityFetcher.getByUsername(username)
                .getFollowed()
                .stream()
                .map(SocialMapper::toDto)
                .toList();
    }

    public void editUserFollowed(String username, String followedUsername, EditUserFriendsType type) throws UserNotFoundByUsernameException, UserAlreadyFollowedException, UserNotFollowedException, UnsupportedEditUserFriendsTypeException {
        switch (type){
            case ADD -> addUserFollowed(username, followedUsername);
            case REMOVE -> removeUserFollowed(username, followedUsername);
            default -> throw new UnsupportedEditUserFriendsTypeException(type);
        }
    }

    private void addUserFollowed(String username, String followedUsername) throws UserNotFoundByUsernameException, UserAlreadyFollowedException {
        var user = userEntityFetcher.getByUsername(username);
        var followedUser = userEntityFetcher.getByUsername(followedUsername);

        var isAlreadyFollowed = user.getFollowed()
                .stream()
                .anyMatch(f -> f.equals(followedUser));

        if (!isAlreadyFollowed) {
            user.getFollowed().add(followedUser);
            followedUser.getFollowers().add(user);

            userEntityRepository.save(user);
            userEntityRepository.save(followedUser);
        } else {
            throw new UserAlreadyFollowedException();
        }
    }

    private void removeUserFollowed(String username, String followedUsername) throws UserNotFoundByUsernameException, UserNotFollowedException {
        var user = userEntityFetcher.getByUsername(username);
        var followedUser = userEntityFetcher.getByUsername(followedUsername);

        var isAlreadyFollowed = user.getFollowed()
                .stream()
                .anyMatch(f -> f.equals(followedUser));

        if (isAlreadyFollowed) {
            user.getFollowed().remove(followedUser);
            followedUser.getFollowers().remove(user);

            userEntityRepository.save(user);
            userEntityRepository.save(followedUser);
        } else {
            throw new UserNotFollowedException();
        }
    }
}
