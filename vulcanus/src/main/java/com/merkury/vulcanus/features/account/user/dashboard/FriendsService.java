package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.FriendshipAlreadyExistException;
import com.merkury.vulcanus.exception.exceptions.FriendshipNotExistException;
import com.merkury.vulcanus.exception.exceptions.UnsupportedEditUserFriendsTypeException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.social.SocialDto;
import com.merkury.vulcanus.model.entities.Friendship;
import com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import com.merkury.vulcanus.model.mappers.user.dashboard.SocialMapper;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType.ADD;
import static com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType.REMOVE;
import static com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus.PENDING;

@Service
@RequiredArgsConstructor
public class FriendsService {
    private final UserEntityRepository userEntityRepository;
    private final UserEntityFetcher userEntityFetcher;

    public List<SocialDto> getUserFriends(String username) throws UserNotFoundByUsernameException {
        return userEntityFetcher.getByUsername(username)
                .getFriendships()
                .stream()
                .map(SocialMapper::toDto)
                .toList();
    }

    public void editUserFriends(String username, String friendUsername, EditUserFriendsType type) throws UserNotFoundByUsernameException, FriendshipAlreadyExistException, FriendshipNotExistException, UnsupportedEditUserFriendsTypeException {
        switch (type){
            case ADD -> addUserFriends(username, friendUsername);
            case REMOVE -> removeUserFriends(username, friendUsername);
            default -> throw new UnsupportedEditUserFriendsTypeException(type);
        }
    }

    private void addUserFriends(String username, String friendUsername) throws UserNotFoundByUsernameException, FriendshipAlreadyExistException {
        var user = userEntityFetcher.getByUsername(username);
        var friendUser = userEntityFetcher.getByUsername(friendUsername);
        var isFriends = user.getFriendships()
                .stream()
                .anyMatch(f -> f.getFriend().equals(friendUser));

        if (!isFriends){
            user.getFriendships().add(new Friendship(null, user, friendUser, PENDING, null));
            friendUser.getFriendships().add(new Friendship(null, friendUser, user, PENDING, null));

            userEntityRepository.save(user);
            userEntityRepository.save(friendUser);
        }else {
            throw new FriendshipAlreadyExistException();
        }
    }

    private void removeUserFriends(String username, String friendUsername) throws UserNotFoundByUsernameException, FriendshipNotExistException {
        var user = userEntityFetcher.getByUsername(username);
        var userFriend = userEntityFetcher.getByUsername(friendUsername);
        var isFriends = user.getFriendships()
                .stream()
                .anyMatch(f -> f.getFriend().equals(userFriend));

        if(isFriends) {
            user.getFriendships().removeIf(f -> f.getFriend().equals(userFriend));
            userFriend.getFriendships().removeIf(f -> f.getFriend().equals(user));

            userEntityRepository.save(user);
            userEntityRepository.save(userFriend);
        }else {
            throw new FriendshipNotExistException();
        }
    }

    public void changeUserFriendsStatus(String username, String friendUsername, UserFriendStatus status) throws UserNotFoundByUsernameException, FriendshipNotExistException {
        var user = userEntityFetcher.getByUsername(username);
        var friendUser = userEntityFetcher.getByUsername(friendUsername);
        var isFriends = user.getFriendships()
                .stream()
                .anyMatch(f -> f.getFriend().equals(friendUser));

        if (isFriends){
           user.getFriendships().forEach(f -> f.setStatus(status));
           friendUser.getFriendships().forEach(f -> f.setStatus(status));

            userEntityRepository.save(user);
            userEntityRepository.save(friendUser);
        }else {
            throw new FriendshipNotExistException();
        }
    }
}
