package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.FriendshipAlreadyExistException;
import com.merkury.vulcanus.exception.exceptions.FriendshipNotExistException;
import com.merkury.vulcanus.exception.exceptions.UnsupportedEditUserFriendsTypeException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.entities.Friendship;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.merkury.vulcanus.model.enums.user.dashboard.EditUserFriendsType.*;
import static com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus.ACCEPTED;
import static com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus.PENDING;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FriendsServiceTest {
    @Mock
    private UserEntityRepository userEntityRepository;

    @Mock
    private UserEntityFetcher userEntityFetcher;

    @InjectMocks
    private FriendsService friendsService;

    @Test
    void shouldReturnFriendsWhenExist() throws UserNotFoundByUsernameException {
        var user = UserEntity.builder().username("user1").build();
        var userFriend1 = UserEntity.builder().username("user2").build();
        var userFriend2 = UserEntity.builder().username("user3").build();

        user.getFriendships().add(new Friendship(null, user, userFriend1, null, null));
        user.getFriendships().add(new Friendship(null, user, userFriend2, null, null));
        userFriend1.getFriendships().add(new Friendship(null, userFriend1, user, null, null));
        userFriend2.getFriendships().add(new Friendship(null, userFriend2, user, null, null));

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);

        var result = friendsService.getUserFriends("user1");

        assertAll(() -> assertNotNull(result),
                () -> assertTrue(result.stream().anyMatch(f -> f.username().equals("user2"))),
                () -> assertTrue(result.stream().anyMatch(f -> f.username().equals("user3"))));
    }

    @Test
    void shouldThrowUserNotFoundByUsernameExceptionWhenUserNotFound() throws UserNotFoundByUsernameException {
        when(userEntityFetcher.getByUsername(anyString())).thenThrow(new UserNotFoundByUsernameException(""));
        assertThrows(UserNotFoundByUsernameException.class, () -> friendsService.getUserFriends(anyString()));
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

