package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UnsupportedEditUserFriendsTypeException;
import com.merkury.vulcanus.exception.exceptions.UserAlreadyFollowedException;
import com.merkury.vulcanus.exception.exceptions.UserNotFollowedException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.features.chat.ChatService;
import com.merkury.vulcanus.model.entities.UserEntity;
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

import java.util.HashMap;
import java.util.List;

import static com.merkury.vulcanus.model.enums.user.dashboard.UserRelationEditType.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FollowersServiceTest {

    @Mock
    private UserEntityRepository userEntityRepository;

    @Mock
    private ChatService chatService;

    @Mock
    private UserEntityFetcher userEntityFetcher;

    @InjectMocks
    private FollowersService followersService;

    @Test
    void shouldReturnFollowersWhenExist() throws UserNotFoundByUsernameException {
        var user = UserEntity.builder().username("user1").build();
        var userFollower1 = UserEntity.builder().username("user2").build();
        var userFollower2 = UserEntity.builder().username("user3").build();
        var pageable = PageRequest.of(0, 10);

        user.getFollowers().add(userFollower1);
        user.getFollowers().add(userFollower2);

        var followedPage = new PageImpl<>(List.of(userFollower1, userFollower2), pageable, 2);

        when(userEntityRepository.findFollowersByFollowedUsername(eq("user1"), any(Pageable.class))).thenReturn(followedPage);
        when(chatService.mapPrivateChatIdsByUsername(any(), any())).thenReturn(new HashMap<>());

        var result = followersService.getUserFollowers("user1", 0, 10).items();

        assertAll(() -> assertNotNull(result),
                () -> assertTrue(result.stream().anyMatch(f -> f.username().equals("user2"))),
                () -> assertTrue(result.stream().anyMatch(f -> f.username().equals("user3"))));
    }

    @Test
    void shouldReturnFollowedWhenExist() throws UserNotFoundByUsernameException {
        var user = UserEntity.builder().username("user1").build();
        var userFollower1 = UserEntity.builder().username("user2").build();
        var userFollower2 = UserEntity.builder().username("user3").build();
        var pageable = PageRequest.of(0, 10);

        user.getFollowed().add(userFollower1);
        user.getFollowed().add(userFollower2);

        var followersPage = new PageImpl<>(List.of(userFollower1, userFollower2), pageable, 2);

        when(userEntityRepository.findFollowedByFollowersUsername(eq("user1"), any(Pageable.class))).thenReturn(followersPage);
        when(chatService.mapPrivateChatIdsByUsername(any(), any())).thenReturn(new HashMap<>());

        var result = followersService.getUserFollowed("user1", 0, 10).items();

        assertAll(() -> assertNotNull(result),
                () -> assertTrue(result.stream().anyMatch(f -> f.username().equals("user2"))),
                () -> assertTrue(result.stream().anyMatch(f -> f.username().equals("user3"))));
    }

    @Test
    void shouldThrowUserNotFoundByUsernameExceptionWhenUserNotFound() {
        when(userEntityRepository.findFollowersByFollowedUsername(anyString(), any(Pageable.class))).thenReturn(Page.empty());

        assertThrows(UserNotFoundByUsernameException.class, () -> followersService.getUserFollowers("user1", 0, 10));
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
