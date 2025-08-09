package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.FriendshipAlreadyExistException;
import com.merkury.vulcanus.exception.exceptions.FriendshipNotExistException;
import com.merkury.vulcanus.exception.exceptions.UnsupportedEditUserFriendsTypeException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.entities.Friendship;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.interfaces.FriendView;
import com.merkury.vulcanus.model.repositories.FriendshipRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus.ACCEPTED;
import static com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus.PENDING;
import static com.merkury.vulcanus.model.enums.user.dashboard.UserRelationEditType.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FriendsServiceTest {
    @Mock
    private UserEntityRepository userEntityRepository;

    @Mock
    private UserEntityFetcher userEntityFetcher;

    @Mock
    private FriendshipRepository friendshipRepository;

    @InjectMocks
    private FriendsService friendsService;

    @Test
    void shouldReturnFriendsWhenExist() throws UserNotFoundByUsernameException {
        FriendView friend1 = mock(FriendView.class);
        FriendView.UserInfo userInfo1 = mock(FriendView.UserInfo.class);
        when(userInfo1.getUsername()).thenReturn("user2");
        when(friend1.getFriend()).thenReturn(userInfo1);

        FriendView friend2 = mock(FriendView.class);
        FriendView.UserInfo userInfo2 = mock(FriendView.UserInfo.class);
        when(userInfo2.getUsername()).thenReturn("user3");
        when(friend2.getFriend()).thenReturn(userInfo2);

        var friends = List.of(friend1, friend2);
        var friendPage = new PageImpl<>(friends, PageRequest.of(0, 10), friends.size());

        when(friendshipRepository.findAllByUserUsername(anyString(), any(Pageable.class))).thenReturn(friendPage);

        var result = friendsService.getUserFriends("user1", 0, 10).items();

        assertAll(
                () -> assertNotNull(result),
                () -> assertEquals(2, result.size()),
                () -> assertTrue(result.stream().anyMatch(f -> f.username().equals("user2"))),
                () -> assertTrue(result.stream().anyMatch(f -> f.username().equals("user3")))
        );
    }


    @Test
    void shouldThrowUserNotFoundByUsernameExceptionWhenUserNotFound() {
        when(friendshipRepository.findAllByUserUsername(anyString(), any(Pageable.class))).thenReturn(Page.empty());

        assertThrows(UserNotFoundByUsernameException.class, () -> friendsService.getUserFriends("nonexistentUser", 0, 10));
    }

    @Test
    void shouldAddFriendWhenNotFriends() throws UserNotFoundByUsernameException, FriendshipAlreadyExistException, FriendshipNotExistException, UnsupportedEditUserFriendsTypeException {
        var user = UserEntity.builder().username("user1").build();
        var friend = UserEntity.builder().username("user2").build();

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);
        when(userEntityFetcher.getByUsername("user2")).thenReturn(friend);

        friendsService.editUserFriends("user1", "user2", ADD);

        assertAll(() -> assertEquals(1, user.getFriendships().size()),
                () -> assertEquals(1, friend.getFriendships().size()));
    }

    @Test
    void shouldThrowUserNotFoundByUsernameExceptionWhenAddingExistingFriend() throws UserNotFoundByUsernameException {
        var user = UserEntity.builder().username("user1").build();
        var friend = UserEntity.builder().username("user2").build();
        user.getFriendships().add(new Friendship(null, user, friend, null, null));

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);
        when(userEntityFetcher.getByUsername("user2")).thenReturn(friend);

        assertThrows(FriendshipAlreadyExistException.class,
                () -> friendsService.editUserFriends("user1", "user2", ADD));
    }

    @Test
    void shouldRemoveFriendWhenExist() throws UserNotFoundByUsernameException, FriendshipAlreadyExistException, FriendshipNotExistException, UnsupportedEditUserFriendsTypeException {
        var user = UserEntity.builder().username("user1").build();
        var friend = UserEntity.builder().username("user2").build();
        user.getFriendships().add(new Friendship(null, user, friend, null, null));
        friend.getFriendships().add(new Friendship(null, friend, user, null, null));

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);
        when(userEntityFetcher.getByUsername("user2")).thenReturn(friend);

        friendsService.editUserFriends("user1", "user2", REMOVE);

        assertAll(() -> assertTrue(user.getFriendships().isEmpty()),
                () -> assertTrue(friend.getFriendships().isEmpty()));
    }

    @Test
    void shouldThrowUserNotFoundByUsernameExceptionWhenFriendNotExist() throws UserNotFoundByUsernameException {
        var user = UserEntity.builder().username("user1").build();
        var friend = UserEntity.builder().username("user2").build();

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);
        when(userEntityFetcher.getByUsername("user2")).thenReturn(friend);

        assertThrows(FriendshipNotExistException.class,
                () -> friendsService.editUserFriends("user1", "user2", REMOVE));
    }

    @Test
    void shouldChangeFriendStatusWhenFriendExist() throws UserNotFoundByUsernameException, FriendshipNotExistException {
        var user = UserEntity.builder().username("user1").build();
        var friend = UserEntity.builder().username("user2").build();
        user.getFriendships().add(new Friendship(null, user, friend, PENDING, null));
        friend.getFriendships().add(new Friendship(null, friend, user, PENDING, null));

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);
        when(userEntityFetcher.getByUsername("user2")).thenReturn(friend);

        friendsService.changeUserFriendsStatus("user1", "user2", ACCEPTED);

        assertAll(() -> assertTrue(user.getFriendships()
                        .stream()
                        .anyMatch(f -> f.getFriend().equals(friend) && f.getStatus().equals(ACCEPTED))),
                () -> assertTrue(friend.getFriendships()
                        .stream()
                        .anyMatch(f -> f.getFriend().equals(user) && f.getStatus().equals(ACCEPTED))));

    }

    @Test
    void shouldThrowUserNotFoundByUsernameExceptionWhenChangeFriendStatusAndFriendNotExist() throws UserNotFoundByUsernameException {
        var user = UserEntity.builder().username("user1").build();
        var friend = UserEntity.builder().username("user2").build();

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);
        when(userEntityFetcher.getByUsername("user2")).thenReturn(friend);

        assertThrows(FriendshipNotExistException.class,
                () -> friendsService.changeUserFriendsStatus("user1", "user2", ACCEPTED));
    }

    @Test
    void shouldThrowUnsupportedEditUserFriendsTypeExceptionWhenEnterWrongType() {
        assertThrows(UnsupportedEditUserFriendsTypeException.class,
                () -> friendsService.editUserFriends("user1", "user2", UNKNOWN));
    }
}

