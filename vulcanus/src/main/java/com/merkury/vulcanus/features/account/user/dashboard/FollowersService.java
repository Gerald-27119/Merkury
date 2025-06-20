package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UserAlreadyFollowedException;
import com.merkury.vulcanus.exception.exceptions.UserNotFollowedException;
import com.merkury.vulcanus.exception.exceptions.UnsupportedEditUserFriendsTypeException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.social.ExtendedSocialDto;
import com.merkury.vulcanus.model.dtos.account.social.SocialDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.user.dashboard.UserRelationEditType;
import com.merkury.vulcanus.model.mappers.user.dashboard.SocialMapper;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowersService {
    private final UserEntityRepository userEntityRepository;
    private final UserEntityFetcher userEntityFetcher;

    public List<SocialDto> getUserOwnFollowers(String username) throws UserNotFoundByUsernameException {
        return userEntityFetcher.getByUsername(username)
                .getFollowers()
                .stream()
                .map(SocialMapper::toDto)
                .toList();
    }

    public List<ExtendedSocialDto> getUserFollowersForViewer(String viewerUsername, String targetUsername) throws UserNotFoundByUsernameException {
        var anotherUser = userEntityFetcher.getByUsername(targetUsername);
        var userFollowers = anotherUser.getFollowers().stream().map(SocialMapper::toDto).toList();

        return getExtendedSocialDtoList(viewerUsername, userFollowers);
    }

    @NotNull
    private List<ExtendedSocialDto> getExtendedSocialDtoList(String viewerUsername, List<SocialDto> userFollowers) throws UserNotFoundByUsernameException {
        if (viewerUsername != null) {
            var user = userEntityFetcher.getByUsername(viewerUsername);

            return userFollowers.stream().map(f -> SocialMapper.toDto(f, getIsUsersFollowing(user, f), user.getUsername().equals(f.username()))).toList();
        }

        return userFollowers.stream().map(f -> SocialMapper.toDto(f, false, false)).toList();
    }

    public List<SocialDto> getUserOwnFollowed(String username) throws UserNotFoundByUsernameException {
        return userEntityFetcher.getByUsername(username)
                .getFollowed()
                .stream()
                .map(SocialMapper::toDto)
                .toList();
    }

    public List<ExtendedSocialDto> getUserFollowedForViewer(String viewerUsername, String targetUsername) throws UserNotFoundByUsernameException {
        var anotherUser = userEntityFetcher.getByUsername(targetUsername);
        var userFriends = anotherUser.getFollowed().stream().map(SocialMapper::toDto).toList();

        return getExtendedSocialDtoList(viewerUsername, userFriends);
    }

    public void editUserFollowed(String username, String followedUsername, UserRelationEditType type) throws UserNotFoundByUsernameException, UserAlreadyFollowedException, UserNotFollowedException, UnsupportedEditUserFriendsTypeException {
        switch (type) {
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

    private Boolean getIsUsersFollowing(UserEntity user, SocialDto secondUser) {
        return user.getFollowed().stream().anyMatch(f -> f.getUsername().equals(secondUser.username()));
    }
}
