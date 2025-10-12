package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.features.chat.ChatService;
import com.merkury.vulcanus.model.dtos.account.social.SocialPageDto;
import com.merkury.vulcanus.model.entities.Friendship;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import com.merkury.vulcanus.model.enums.user.dashboard.UserRelationEditType;
import com.merkury.vulcanus.model.mappers.user.dashboard.SocialMapper;
import com.merkury.vulcanus.model.repositories.FriendshipRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus.*;

@Service
@RequiredArgsConstructor
public class FriendsService {
    private final UserEntityRepository userEntityRepository;
    private final UserEntityFetcher userEntityFetcher;
    private final FriendshipRepository friendshipRepository;
    private final ChatService chatService;

    public SocialPageDto getUserFriends(String username, int page, int size) throws UserNotFoundByUsernameException {
        if (!userEntityRepository.existsByUsername(username)) {
            throw new UserNotFoundByUsernameException(username);
        }

        var friendsPage = friendshipRepository.findAllByUserUsernameAndStatus(username, PageRequest.of(page, size), UserFriendStatus.ACCEPTED);

        if (friendsPage.isEmpty()) {
            return new SocialPageDto(List.of(), false);
        }

        var friendUsernames = friendsPage.getContent()
                .stream()
                .map(friendView -> friendView.getFriend().getUsername())
                .toList();
        var friendsUsernamePrivateChatIdMap = chatService.mapPrivateChatIdsByUsername(username, friendUsernames);
        boolean isFriendOfUser = true;
        var mappedFriends = friendsPage.stream()
                .map(friendView -> {
                    var friendUsername = friendView.getFriend().getUsername();
                    var privateChatId = friendsUsernamePrivateChatIdMap.get(friendUsername);

                    return SocialMapper.friendViewToSocialDto(friendView, privateChatId, isFriendOfUser);
                })
                .toList();
        return new SocialPageDto(mappedFriends, friendsPage.hasNext());
    }

    public void editUserFriends(String username, String friendUsername, UserRelationEditType type) throws UserNotFoundByUsernameException, FriendshipAlreadyExistException, FriendshipNotExistException, UnsupportedEditUserFriendsTypeException {
        switch (type) {
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

        if (!isFriends) {
            user.getFriendships().add(new Friendship(null, user, friendUser, PENDING_SENT, null));
            friendUser.getFriendships().add(new Friendship(null, friendUser, user, PENDING_RECEIVED, null));

            userEntityRepository.save(user);
            userEntityRepository.save(friendUser);
        } else {
            throw new FriendshipAlreadyExistException();
        }
    }

    private void removeUserFriends(String username, String friendUsername) throws UserNotFoundByUsernameException, FriendshipNotExistException {
        var user = userEntityFetcher.getByUsername(username);
        var userFriend = userEntityFetcher.getByUsername(friendUsername);
        var isFriends = user.getFriendships()
                .stream()
                .anyMatch(f -> f.getFriend().equals(userFriend));

        if (isFriends) {
            user.getFriendships().removeIf(f -> f.getFriend().equals(userFriend));
            userFriend.getFriendships().removeIf(f -> f.getFriend().equals(user));

            userEntityRepository.save(user);
            userEntityRepository.save(userFriend);
        } else {
            throw new FriendshipNotExistException();
        }
    }

    public void changeUserFriendsStatus(String username, String friendUsername, UserFriendStatus status) throws UserNotFoundByUsernameException, FriendshipNotExistException, UnsupportedUserFriendStatusException {
        var user = userEntityFetcher.getByUsername(username);
        var friendUser = userEntityFetcher.getByUsername(friendUsername);

        var uf = user.getFriendships().stream()
                .filter(f -> f.getFriend().equals(friendUser))
                .findFirst()
                .orElseThrow(FriendshipNotExistException::new);

        var fu = friendUser.getFriendships().stream()
                .filter(f -> f.getFriend().equals(user))
                .findFirst()
                .orElseThrow(FriendshipNotExistException::new);

        switch (status) {
            case REJECTED -> {
                user.getFriendships().remove(uf);
                friendUser.getFriendships().remove(fu);
                friendshipRepository.deleteAll(List.of(uf, fu));
            }
            case ACCEPTED -> {
                uf.setStatus(UserFriendStatus.ACCEPTED);
                fu.setStatus(UserFriendStatus.ACCEPTED);
            }
            default -> throw new UnsupportedUserFriendStatusException(status);
        }

        userEntityRepository.save(user);
        userEntityRepository.save(friendUser);
    }

    public SocialPageDto searchUsersByUsername(String username, String query, int page, int size) throws UserNotFoundByUsernameException {
        var currentUser = userEntityFetcher.getByUsername(username);

        if (query == null || query.isBlank()) {
            return new SocialPageDto(List.of(), false);
        }

        var pageable = PageRequest.of(page, size, Sort.by("username").ascending());
        var usersPage = userEntityRepository.findAllByUsernameContainingIgnoreCaseAndUsernameNot(query, pageable, currentUser.getUsername());

        if (usersPage.isEmpty()) {
            return new SocialPageDto(List.of(), false);
        }

        var mappedUsers = usersPage.getContent().stream()
                .map(user -> {
                    var status = currentUser.getFriendships()
                            .stream()
                            .filter(f -> f.getFriend().equals(user))
                            .map(Friendship::getStatus)
                            .findFirst()
                            .orElse(UserFriendStatus.NONE);

                    return SocialMapper.toDto(user, status);
                })
                .toList();

        return new SocialPageDto(mappedUsers, usersPage.hasNext());
    }

    public SocialPageDto getAllFriendInvites(String username, int page, int size) throws UserNotFoundByUsernameException {
        if (!userEntityRepository.existsByUsername(username)) {
            throw new UserNotFoundByUsernameException(username);
        }

        var friendsPage = friendshipRepository.findAllByUserUsernameAndStatus(username, PageRequest.of(page, size), PENDING_RECEIVED);

        if (friendsPage.isEmpty()) {
            return new SocialPageDto(List.of(), false);
        }

        var mappedInvites = friendsPage.stream()
                .map(friendView -> SocialMapper.friendViewToSocialDto(friendView, null, false))
                .toList();

        return new SocialPageDto(mappedInvites, friendsPage.hasNext());
    }
}
