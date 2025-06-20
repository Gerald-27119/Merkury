package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UserAlreadyFollowedException;
import com.merkury.vulcanus.exception.exceptions.UserNotFollowedException;
import com.merkury.vulcanus.exception.exceptions.UnsupportedEditUserFriendsTypeException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.merkury.vulcanus.model.enums.user.dashboard.UserRelationEditType.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FollowersServiceTest {

    @Mock
    private UserEntityRepository userEntityRepository;

    @Mock
    private UserEntityFetcher userEntityFetcher;

    @InjectMocks
    private FollowersService followersService;

    @Test
    void shouldReturnFollowersWhenExist() throws UserNotFoundByUsernameException {
        var user = UserEntity.builder().username("user1").build();
        var userFollower1 = UserEntity.builder().username("user2").build();
        var userFollower2 = UserEntity.builder().username("user3").build();

        user.getFollowers().add(userFollower1);
        user.getFollowers().add(userFollower2);

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);

        var result = followersService.getUserOwnFollowers("user1");

        assertAll(() -> assertNotNull(result),
                () -> assertTrue(result.stream().anyMatch(f -> f.username().equals("user2"))),
                () -> assertTrue(result.stream().anyMatch(f -> f.username().equals("user3"))));
    }

    @Test
    void shouldReturnFollowedWhenExist() throws UserNotFoundByUsernameException {
        var user = UserEntity.builder().username("user1").build();
        var userFollower1 = UserEntity.builder().username("user2").build();
        var userFollower2 = UserEntity.builder().username("user3").build();

        user.getFollowed().add(userFollower1);
        user.getFollowed().add(userFollower2);

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);

        var result = followersService.getUserOwnFollowed("user1");

        assertAll(() -> assertNotNull(result),
                () -> assertTrue(result.stream().anyMatch(f -> f.username().equals("user2"))),
                () -> assertTrue(result.stream().anyMatch(f -> f.username().equals("user3"))));
    }

    @Test
    void shouldThrowUserNotFoundByUsernameExceptionWhenUserNotFound() throws UserNotFoundByUsernameException {
        when(userEntityFetcher.getByUsername(anyString())).thenThrow(new UserNotFoundByUsernameException(""));
        assertThrows(UserNotFoundByUsernameException.class, () -> followersService.getUserOwnFollowers(anyString()));
    }

    @Test
    void shouldAddFollowerWhenNotAtFollowerList() throws UserNotFoundByUsernameException, UserAlreadyFollowedException, UserNotFollowedException, UnsupportedEditUserFriendsTypeException {
        var user = UserEntity.builder().username("user1").build();
        var follower = UserEntity.builder().username("user2").build();

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);
        when(userEntityFetcher.getByUsername("user2")).thenReturn(follower);

        followersService.editUserFollowed("user1", "user2", ADD);

        assertAll(() -> assertEquals(1, user.getFollowed().size()),
                () -> assertTrue(user.getFollowed().contains(follower)));
    }

    @Test
    void shouldThrowUserNotFoundByUsernameExceptionWhenAddExistingFollower() throws UserNotFoundByUsernameException {
        var user = UserEntity.builder().username("user1").build();
        var follower = UserEntity.builder().username("user2").build();
        user.getFollowed().add(follower);
        follower.getFollowers().add(user);

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);
        when(userEntityFetcher.getByUsername("user2")).thenReturn(follower);

        assertThrows(UserAlreadyFollowedException.class,
                () -> followersService.editUserFollowed("user1", "user2", ADD));
    }

    @Test
    void shouldRemoveFollowerWhenFollowerExist() throws UserNotFoundByUsernameException, UserAlreadyFollowedException, UserNotFollowedException, UnsupportedEditUserFriendsTypeException {
        var user = UserEntity.builder().username("user1").build();
        var follower = UserEntity.builder().username("user2").build();
        user.getFollowed().add(follower);
        follower.getFollowed().add(user);

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);
        when(userEntityFetcher.getByUsername("user2")).thenReturn(follower);

        followersService.editUserFollowed("user1", "user2", REMOVE);

        assertAll(() -> assertTrue(user.getFollowed().isEmpty()),
                () -> assertFalse(user.getFollowed().contains(follower)));
    }

    @Test
    void shouldThrowUserNotFoundByUsernameExceptionWhenRemoveFollowerNotExist() throws UserNotFoundByUsernameException {
        var user = UserEntity.builder().username("user1").build();

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);

        assertThrows(UserNotFollowedException.class,
                () -> followersService.editUserFollowed("user1", "user2", REMOVE));
    }

    @Test
    void shouldThrowUnsupportedEditUserFriendsTypeExceptionWhenEnterWrongType() {
        assertThrows(UnsupportedEditUserFriendsTypeException.class,
                () -> followersService.editUserFollowed("user1", "user2", UNKNOWN));
    }
}
