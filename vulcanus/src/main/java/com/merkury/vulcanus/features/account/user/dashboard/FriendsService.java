package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.FollowedConnectionAlreadyExist;
import com.merkury.vulcanus.exception.exceptions.FriendshipAlreadyExist;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.friends.FriendDto;
import com.merkury.vulcanus.model.entities.Friendship;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType;
import com.merkury.vulcanus.model.mappers.user.dashboard.FriendsMapper;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType.ADD;
import static com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType.REMOVE;

@Service
@RequiredArgsConstructor
public class FriendsService {
    private final UserEntityRepository userEntityRepository;

    public List<FriendDto> getUserFriends(String username) throws UserNotFoundByUsernameException {
        return getUserByUsername(username)
                .getFriendships()
                .stream()
                .map(FriendsMapper::toDto)
                .toList();
    }

    public void editUserFriends(String username, String friendUsername, EditUserFriendsType type) throws UserNotFoundByUsernameException, FriendshipAlreadyExist {
        if (type == ADD){
            addUserFriends(username, friendUsername);
        } else if (type == REMOVE) {
            removeUserFriends(username, friendUsername);
        }
    }

    private void addUserFriends(String username, String friendUsername) throws UserNotFoundByUsernameException, FriendshipAlreadyExist {
        var user = getUserByUsername(username);
        var friendUser = getUserByUsername(friendUsername);
        var isFriends = user.getFriendships()
                .stream()
                .anyMatch(f -> f.getFriend().getUsername().equals(friendUsername));

        if (!isFriends){
            /// TO DO dodanie obsługi statusów
            user.getFriendships().add(new Friendship(null, user, friendUser, "Accepted", null));
            friendUser.getFriendships().add(new Friendship(null, friendUser, user, "Accepted", null));

            userEntityRepository.save(user);
            userEntityRepository.save(friendUser);
        }else {
            throw new FriendshipAlreadyExist();
        }
    }

    private void removeUserFriends(String username, String friendUsername) throws UserNotFoundByUsernameException {
        var user = getUserByUsername(username);
        var userFriend = getUserByUsername(friendUsername);

        user.getFriendships().removeIf(f -> f.getFriend().getUsername().equals(friendUsername));
        userFriend.getFriendships().removeIf(f-> f.getFriend().getUsername().equals(username));

        userEntityRepository.save(user);
        userEntityRepository.save(userFriend);
    }

    private UserEntity getUserByUsername(String username) throws UserNotFoundByUsernameException {
        return userEntityRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundByUsernameException(username));
    }

    public List<FriendDto> getUserFollowers(String username) throws UserNotFoundByUsernameException {
        return getUserByUsername(username)
                .getFollowers()
                .stream()
                .map(FriendsMapper::toDto)
                .toList();
    }

    public List<FriendDto> getUserFollowed(String username) throws UserNotFoundByUsernameException {
        return getUserByUsername(username)
                .getFollowed()
                .stream()
                .map(FriendsMapper::toDto)
                .toList();
    }

    public void editUserFollowed(String username, String followedUsername, EditUserFriendsType type) throws UserNotFoundByUsernameException, FollowedConnectionAlreadyExist {
        if (type == ADD){
            addUserFollowed(username, followedUsername);
        } else if (type == REMOVE) {
            removeUserFollowed(username, followedUsername);
        }
    }

    private void addUserFollowed(String username, String followedUsername) throws UserNotFoundByUsernameException, FollowedConnectionAlreadyExist {
        var user = getUserByUsername(username);
        var followedUser = getUserByUsername(followedUsername);
        var isFollowed = user.getFollowed()
                .stream()
                .anyMatch(f -> f.getUsername().equals(followedUsername));

        if (!isFollowed){
            followedUser.getFollowers().add(user);

            userEntityRepository.save(followedUser);
        }else {
            throw new FollowedConnectionAlreadyExist();
        }
    }

    private void removeUserFollowed(String username, String followedUsername) throws UserNotFoundByUsernameException {
        var user = getUserByUsername(followedUsername);

        user.getFollowers().removeIf(f -> f.getUsername().equals(username));

        userEntityRepository.save(user);
    }
}
