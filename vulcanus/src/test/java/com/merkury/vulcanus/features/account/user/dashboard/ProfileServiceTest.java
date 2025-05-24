package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Optional;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private UserEntityRepository userEntityRepository;

    @InjectMocks
    private ProfileService profileService;

    @Test
    void shouldReturnUserProfileWhenUserExists() throws UserNotFoundByUsernameException {
        var user = new UserEntity();
        user.setUsername("testUser");
        user.setProfilePhoto("testPhoto");
        user.setFollowers(new HashSet<>());
        user.setFollowed(new HashSet<>());
        user.setFriendships(new ArrayList<>());
        user.setImages(new ArrayList<>());

        when(userEntityRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        var result = profileService.getUserPrivateProfile("testUser");

        assertAll(() -> assertEquals("testUser", result.username()),
                () -> assertEquals("testPhoto", result.profilePhoto()),
                () -> assertEquals(0, result.followersCount()),
                () -> assertEquals(0, result.followedCount()),
                () -> assertEquals(0, result.friendsCount()),
                () -> assertEquals(0, result.photosCount()));
    }

    @Test
    void shouldThrowWhenUserNotFound() {
        when(userEntityRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        assertThrows(UserNotFoundByUsernameException.class, () -> profileService.getUserPrivateProfile(anyString()));
    }

    @Test
    void shouldReturnOnlyTop4MostLikedPhotos() throws UserNotFoundByUsernameException {
        var user = new UserEntity();
        user.setUsername("testUser");

        var images = IntStream.range(0, 10)
                .mapToObj(i -> {
                    Img img = new Img();
                    img.setLikes(10 - i);
                    return img;
                }).toList();

        user.setImages(images);

        when(userEntityRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        var result = profileService.getUserPrivateProfile("testUser");

        assertAll(() -> assertEquals(4, result.mostPopularPhotos().size()),
                () -> assertEquals(10, result.mostPopularPhotos().getFirst().heartsCount()));
    }

    @Test
    void shouldReturnAllPhotosIfLessThanFour() throws UserNotFoundByUsernameException {
        var user = new UserEntity();
        user.setUsername("testUser");

        var images = IntStream.range(0, 3)
                .mapToObj(i -> {
                    Img img = new Img();
                    img.setLikes(i);
                    return img;
                }).toList();

        user.setImages(images);

        when(userEntityRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        var result = profileService.getUserPrivateProfile("testUser");

        assertEquals(3, result.mostPopularPhotos().size());
    }
}
