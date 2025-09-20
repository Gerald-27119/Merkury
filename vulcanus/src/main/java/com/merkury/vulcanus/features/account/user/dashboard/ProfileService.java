package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.BlobContainerNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidFileTypeException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.features.azure.AzureBlobService;
import com.merkury.vulcanus.model.dtos.account.profile.ExtendedUserProfileDto;
import com.merkury.vulcanus.model.dtos.account.profile.ImageDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import com.merkury.vulcanus.model.mappers.user.dashboard.ProfileMapper;
import com.merkury.vulcanus.model.repositories.SpotMediaRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserEntityFetcher userEntityFetcher;
    private final UserEntityRepository userEntityRepository;
    private final SpotMediaRepository spotMediaRepository;
    private final AzureBlobService azureBlobService;

    public UserProfileDto getUserOwnProfile(String username) throws UserNotFoundByUsernameException {
        var user = userEntityFetcher.getByUsername(username);
        var images = get4MostPopularPhotosFromUser(user);
        return ProfileMapper.toDto(user, images);
    }

    public ExtendedUserProfileDto getUserProfileForViewer(String viewerUsername, String targetUsername) throws UserNotFoundByUsernameException {
        var anotherUser = userEntityFetcher.getByUsername(targetUsername);
        var images = get4MostPopularPhotosFromUser(anotherUser);
        var userProfile = ProfileMapper.toDto(anotherUser, images);

        var isFriends = false;
        var isFollowing = false;
        var isOwnProfile = false;

        if (viewerUsername != null) {
            var user = userEntityFetcher.getByUsername(viewerUsername);
            isFriends = getIsUsersFriends(user, anotherUser);
            isFollowing = getIsUsersFollowing(user, anotherUser);
            isOwnProfile = viewerUsername.equals(targetUsername);
        }

        return ProfileMapper.toDto(userProfile, isFriends, isFollowing, isOwnProfile);
    }

    public void changeUserProfilePhoto(String username, MultipartFile profilePhoto) throws UserNotFoundByUsernameException, InvalidFileTypeException, BlobContainerNotFoundException, IOException, URISyntaxException {
        var user = userEntityFetcher.getByUsername(username);

        if (user.getProfilePhoto() != null) {
            azureBlobService.delete("user-profile", user.getProfilePhoto());
        }
        var profilePhotoUrl = azureBlobService.upload("user-profile", profilePhoto);

        user.setProfilePhoto(profilePhotoUrl);
        userEntityRepository.save(user);
    }

    private Boolean getIsUsersFriends(UserEntity user, UserEntity secondUser) {
        return user.getFriendships().stream().anyMatch(f -> f.getFriend().equals(secondUser));
    }

    private Boolean getIsUsersFollowing(UserEntity user, UserEntity secondUser) {
        return user.getFollowed().stream().anyMatch(f -> f.equals(secondUser));
    }

    private List<ImageDto> get4MostPopularPhotosFromUser(UserEntity user) {
        return spotMediaRepository.findTop4ByAuthorAndGenericMediaTypeOrderByLikesDesc(user, GenericMediaType.PHOTO)
                .stream()
                .map(ProfileMapper::toDto)
                .toList();
    }
}
