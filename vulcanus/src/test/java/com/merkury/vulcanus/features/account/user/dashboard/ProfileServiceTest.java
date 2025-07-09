package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.entities.SpotMedia;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import com.merkury.vulcanus.model.repositories.SpotMediaRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private UserEntityRepository userEntityRepository;

    @Mock
    private SpotMediaRepository spotMediaRepository;

    @Mock
    private UserEntityFetcher userEntityFetcher;

    @InjectMocks
    private ProfileService profileService;

    @Test
    void shouldReturnOwnProfileWhenOwnerExists() throws UserNotFoundByUsernameException {
        var user = new UserEntity();
        user.setUsername("testUser");
        user.setProfilePhoto("testPhoto");
        user.setFollowers(new HashSet<>());
        user.setFollowed(new HashSet<>());
        user.setFriendships(new ArrayList<>());
        user.setMedia(new ArrayList<>());

        when(userEntityFetcher.getByUsername("testUser")).thenReturn(user);

        var result = profileService.getUserOwnProfile("testUser");

        assertAll(() -> assertEquals("testUser", result.username()),
                () -> assertEquals("testPhoto", result.profilePhoto()),
                () -> assertEquals(0, result.followersCount()),
                () -> assertEquals(0, result.followedCount()),
                () -> assertEquals(0, result.friendsCount()),
                () -> assertEquals(0, result.photosCount()));
    }

    @Test
    void shouldThrowUserNotFoundByUsernameExceptionWhenOwnerNotFound() throws UserNotFoundByUsernameException {
        when(userEntityFetcher.getByUsername(anyString())).thenThrow(new UserNotFoundByUsernameException(""));
        assertThrows(UserNotFoundByUsernameException.class, () -> profileService.getUserOwnProfile(anyString()));
    }

    @Test
    void shouldReturnOnlyTop4MostLikedPhotos() throws UserNotFoundByUsernameException {
        var user = new UserEntity();
        user.setUsername("testUser");

        var images = IntStream.range(0, 10)
                .mapToObj(i -> {
                    SpotMedia spotMedia = new SpotMedia();
                    spotMedia.setLikes(10 - i);
                    spotMedia.setAuthor(user);
                    spotMedia.setGenericMediaType(GenericMediaType.PHOTO);
                    return spotMedia;
                }).toList();

        var top4Images = images.stream()
                .sorted((a, b) -> Integer.compare(b.getLikes(), a.getLikes()))
                .limit(4)
                .toList();

        when(userEntityFetcher.getByUsername("testUser")).thenReturn(user);
        when(spotMediaRepository.findTop4ByAuthorAndGenericMediaTypeOrderByLikesDesc(user, GenericMediaType.PHOTO)).thenReturn(top4Images);

        var result = profileService.getUserOwnProfile("testUser");

        assertAll(() -> assertEquals(4, result.mostPopularPhotos().size()),
                () -> assertEquals(10, result.mostPopularPhotos().getFirst().heartsCount()));
    }

    @Test
    void shouldReturnAllPhotosIfLessThanFour() throws UserNotFoundByUsernameException {
        var user = new UserEntity();
        user.setUsername("testUser");

        var images = IntStream.range(0, 3)
                .mapToObj(i -> {
                    SpotMedia spotMedia = new SpotMedia();
                    spotMedia.setLikes(i);
                    spotMedia.setAuthor(user);
                    spotMedia.setGenericMediaType(GenericMediaType.PHOTO);
                    return spotMedia;
                }).toList();

        var top4Images = images.stream()
                .sorted((a, b) -> Integer.compare(b.getLikes(), a.getLikes()))
                .limit(4)
                .toList();

        when(userEntityFetcher.getByUsername("testUser")).thenReturn(user);
        when(spotMediaRepository.findTop4ByAuthorAndGenericMediaTypeOrderByLikesDesc(user, GenericMediaType.PHOTO)).thenReturn(top4Images);

        var result = profileService.getUserOwnProfile("testUser");

        assertEquals(3, result.mostPopularPhotos().size());
    }

    @Test
    void shouldReturnTargetUserProfileWhenViewerIsAnotherUser() throws UserNotFoundByUsernameException {
        var user = new UserEntity();
        user.setUsername("testUser");

        var anotherUser = new UserEntity();
        anotherUser.setUsername("anotherUser");
        anotherUser.setProfilePhoto("testPhoto");
        anotherUser.setFollowers(new HashSet<>());
        anotherUser.setFollowed(new HashSet<>());
        anotherUser.setFriendships(new ArrayList<>());
        anotherUser.setMedia(new ArrayList<>());

        when(userEntityFetcher.getByUsername("testUser")).thenReturn(user);
        when(userEntityFetcher.getByUsername("anotherUser")).thenReturn(anotherUser);

        var result = profileService.getUserProfileForViewer("testUser", "anotherUser");

        assertAll(() -> assertEquals("anotherUser", result.profile().username()),
                () -> assertEquals("testPhoto", result.profile().profilePhoto()),
                () -> assertEquals(0, result.profile().followersCount()),
                () -> assertEquals(0, result.profile().followedCount()),
                () -> assertEquals(0, result.profile().friendsCount()),
                () -> assertEquals(0, result.profile().photosCount()));
    }

    @Test
    void shouldReturnUserOwnProfileWhenViewerIsOwnUser() throws UserNotFoundByUsernameException {
        var user = new UserEntity();
        user.setUsername("testUser");
        user.setProfilePhoto("testPhoto");
        user.setFollowers(new HashSet<>());
        user.setFollowed(new HashSet<>());
        user.setFriendships(new ArrayList<>());
        user.setMedia(new ArrayList<>());


        when(userEntityFetcher.getByUsername("testUser")).thenReturn(user);

        var result = profileService.getUserProfileForViewer("testUser", "testUser");

        assertAll(() -> assertEquals("testUser", result.profile().username()),
                () -> assertEquals("testPhoto", result.profile().profilePhoto()),
                () -> assertEquals(0, result.profile().followersCount()),
                () -> assertEquals(0, result.profile().followedCount()),
                () -> assertEquals(0, result.profile().friendsCount()),
                () -> assertEquals(0, result.profile().photosCount()),
                () -> assertTrue(result.isOwnProfile()),
                () -> assertFalse(result.isFriends()),
                () -> assertFalse(result.isFollowing())
        );
    }
}
