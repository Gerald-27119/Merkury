package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UnsupportedEditUserFriendsTypeException;
import com.merkury.vulcanus.exception.exceptions.UserAlreadyFollowedException;
import com.merkury.vulcanus.exception.exceptions.UserNotFollowedException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.features.chat.ChatService;
import com.merkury.vulcanus.model.dtos.account.social.SocialPageDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.user.dashboard.UserRelationEditType;
import com.merkury.vulcanus.model.mappers.user.dashboard.SocialMapper;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowersService {
    private final UserEntityRepository userEntityRepository;
    private final UserEntityFetcher userEntityFetcher;
    private final ChatService chatService;

    public SocialPageDto getUserFollowers(String username, int page, int size) throws UserNotFoundByUsernameException {
        var followersPage = userEntityRepository.findFollowersByFollowedUsername(username, PageRequest.of(page, size));

        if (!userEntityRepository.existsByUsername(username)) {
            throw new UserNotFoundByUsernameException(username);
        }

        if (followersPage.isEmpty()) {
            return new SocialPageDto(List.of(), false);
        }

        var followerUsernamePrivateChatIdMap = chatService.mapPrivateChatIdsByUsername(
                username,
                followersPage.getContent().stream()
                        .map(UserEntity::getUsername)
                        .toList()
        );
        var mappedFollowers = followersPage.stream()
                .map(follower -> {
                    var chatId = followerUsernamePrivateChatIdMap.get(follower.getUsername());
                    return SocialMapper.userEntityToSocialDto(follower, chatId);
                })
                .toList();
        return new SocialPageDto(mappedFollowers, followersPage.hasNext());
    }

    public SocialPageDto getUserFollowed(String username, int page, int size) throws UserNotFoundByUsernameException {
        var followedPage = userEntityRepository.findFollowedByFollowersUsername(username, PageRequest.of(page, size));

        if (!userEntityRepository.existsByUsername(username)) {
            throw new UserNotFoundByUsernameException(username);
        }

        if (followedPage.isEmpty()) {
            return new SocialPageDto(List.of(), false);
        }

        var followerUsernamePrivateChatIdMap = chatService.mapPrivateChatIdsByUsername(
                username,
                followedPage.getContent().stream()
                        .map(UserEntity::getUsername)
                        .toList()
        );

        var mappedFollowed = followedPage.stream()
                .map(follower -> {
                    var chatId = followerUsernamePrivateChatIdMap.get(follower.getUsername());
                    return SocialMapper.userEntityToSocialDto(follower, chatId);
                })
                .toList();
        return new SocialPageDto(mappedFollowed, followedPage.hasNext());
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
}
