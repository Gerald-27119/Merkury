package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.FollowedAlreadyExistException;
import com.merkury.vulcanus.exception.exceptions.FollowedNotExistException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.friends.FriendDto;
import com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType;
import com.merkury.vulcanus.model.mappers.user.dashboard.FriendsMapper;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType.ADD;
import static com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType.REMOVE;

@Service
@RequiredArgsConstructor
public class FollowersService {
    private final UserEntityRepository userEntityRepository;
    private final UserEntityFetcher userEntityFetcher;

    public List<FriendDto> getUserFollowers(String username) throws UserNotFoundByUsernameException {
        return userEntityFetcher.getByUsername(username)
                .getFollowers()
                .stream()
                .map(FriendsMapper::toDto)
                .toList();
    }

    public List<FriendDto> getUserFollowed(String username) throws UserNotFoundByUsernameException {
        return userEntityFetcher.getByUsername(username)
                .getFollowed()
                .stream()
                .map(FriendsMapper::toDto)
                .toList();
    }

    public void editUserFollowed(String username, String followedUsername, EditUserFriendsType type) throws UserNotFoundByUsernameException, FollowedAlreadyExistException, FollowedNotExistException {
        if (type == ADD) {
            addUserFollowed(username, followedUsername);
        } else if (type == REMOVE) {
            removeUserFollowed(username, followedUsername);
        }
    }

    private void addUserFollowed(String username, String followedUsername) throws UserNotFoundByUsernameException, FollowedAlreadyExistException {
        var user = userEntityFetcher.getByUsername(username);
        var followedUser = userEntityFetcher.getByUsername(followedUsername);
        var isFollowed = user.getFollowers()
                .stream()
                .anyMatch(f -> f.equals(followedUser));

        if (!isFollowed) {
            user.getFollowers().add(followedUser);

            userEntityRepository.save(followedUser);
        } else {
            throw new FollowedAlreadyExistException();
        }
    }

    private void removeUserFollowed(String username, String followedUsername) throws UserNotFoundByUsernameException, FollowedNotExistException {
        var user = userEntityFetcher.getByUsername(username);
        var isFollowed = user.getFollowers()
                .stream()
                .anyMatch(f -> f.getUsername().equals(followedUsername));

        if (isFollowed) {
            user.getFollowers().removeIf(f -> f.getUsername().equals(followedUsername));
            userEntityRepository.save(user);
        } else {
            throw new FollowedNotExistException();
        }
    }
}
