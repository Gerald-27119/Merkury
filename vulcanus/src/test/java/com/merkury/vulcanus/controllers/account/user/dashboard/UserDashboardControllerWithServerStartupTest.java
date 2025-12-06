package com.merkury.vulcanus.controllers.account.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.add.spot.AddSpotPageDto;
import com.merkury.vulcanus.model.dtos.account.comments.DatedCommentsGroupPageDto;
import com.merkury.vulcanus.model.dtos.account.media.DatedMediaGroupPageDto;
import com.merkury.vulcanus.model.dtos.account.profile.ExtendedUserProfileDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.dtos.account.settings.UserDataDto;
import com.merkury.vulcanus.model.dtos.account.settings.UserEditDataDto;
import com.merkury.vulcanus.model.dtos.account.social.SocialPageDto;
import com.merkury.vulcanus.model.dtos.account.spots.FavoriteSpotPageDto;
import com.merkury.vulcanus.model.dtos.user.UserLoginDto;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import com.merkury.vulcanus.model.entities.Friendship;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.spot.FavoriteSpot;
import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.entities.spot.SpotComment;
import com.merkury.vulcanus.model.entities.spot.SpotMedia;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.enums.UserRole;
import com.merkury.vulcanus.model.enums.user.dashboard.FavoriteSpotsListType;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import com.merkury.vulcanus.model.enums.user.dashboard.UserSettingsType;
import com.merkury.vulcanus.model.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.util.LinkedMultiValueMap;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserDashboardControllerWithServerStartupTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserEntityRepository userEntityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private FavoriteSpotRepository favoriteSpotRepository;

    @Autowired
    private SpotMediaRepository spotMediaRepository;

    @Autowired
    private SpotRepository spotRepository;

    @Autowired
    private SpotCommentRepository spotCommentRepository;

    private String jwtCookieHeader;
    private UserEntity mainUser;
    private Spot spot1;
    private Spot spot2;
    private Spot spot3;

    @BeforeEach
    void setUp() {
        spotCommentRepository.deleteAll();
        spotMediaRepository.deleteAll();
        favoriteSpotRepository.deleteAll();
        friendshipRepository.deleteAll();
        spotRepository.deleteAll();
        userEntityRepository.deleteAll();

        mainUser = UserEntity.builder()
                .username("testuser")
                .email("test@example.com")
                .password(passwordEncoder.encode("testpass"))
                .userRole(UserRole.ROLE_USER)
                .provider(Provider.NONE)
                .build();

        var friend1 = UserEntity.builder()
                .username("friend1")
                .email("friend1@example.com")
                .password(passwordEncoder.encode("pass1"))
                .userRole(UserRole.ROLE_USER)
                .build();

        var friend2 = UserEntity.builder()
                .username("friend2")
                .email("friend2@example.com")
                .password(passwordEncoder.encode("pass2"))
                .userRole(UserRole.ROLE_USER)
                .build();

        var friend3 = UserEntity.builder()
                .username("friend3")
                .email("friend3@example.com")
                .password(passwordEncoder.encode("pass3"))
                .userRole(UserRole.ROLE_USER)
                .build();

        var friend4 = UserEntity.builder()
                .username("friend4")
                .email("friend4@example.com")
                .password(passwordEncoder.encode("pass4"))
                .userRole(UserRole.ROLE_USER)
                .build();

        mainUser = userEntityRepository.save(mainUser);
        friend1 = userEntityRepository.save(friend1);
        friend2 = userEntityRepository.save(friend2);
        friend3 = userEntityRepository.save(friend3);
        friend4 = userEntityRepository.save(friend4);

        spot1 = Spot.builder()
                .name("Spot 1")
                .areaColor("#FF0000")
                .city("City A")
                .country("Country A")
                .author(mainUser)
                .borderPoints(List.of(
                        new BorderPoint(40.785091, -73.968285),
                        new BorderPoint(40.784091, -73.969285)
                ))
                .build();

        spot2 = Spot.builder()
                .name("Spot 2")
                .areaColor("#00FF00")
                .city("City B")
                .country("Country B")
                .author(mainUser)
                .borderPoints(List.of(
                        new BorderPoint(40.786000, -73.970000),
                        new BorderPoint(40.787000, -73.971000)
                ))
                .build();

        spot3 = Spot.builder()
                .name("Spot 3")
                .areaColor("#0000FF")
                .city("City C")
                .country("Country C")
                .author(mainUser)
                .borderPoints(List.of(
                        new BorderPoint(40.788000, -73.972000),
                        new BorderPoint(40.789000, -73.973000)
                ))
                .build();

        spot1 = spotRepository.save(spot1);
        spot2 = spotRepository.save(spot2);
        spot3 = spotRepository.save(spot3);

        var media1 = SpotMedia.builder()
                .url("https://example.com/spot1-photo1.jpg")
                .alt("Spot1 photo1")
                .description("Spot 1 description")
                .genericMediaType(GenericMediaType.PHOTO)
                .author(mainUser)
                .spot(spot1)
                .build();

        var media2 = SpotMedia.builder()
                .url("https://example.com/spot2-photo1.jpg")
                .alt("Spot2 photo1")
                .description("Spot 2 description")
                .genericMediaType(GenericMediaType.PHOTO)
                .author(mainUser)
                .spot(spot2)
                .build();

        var media3 = SpotMedia.builder()
                .url("https://example.com/spot3-photo1.jpg")
                .alt("Spot3 photo1")
                .description("Spot 3 description")
                .genericMediaType(GenericMediaType.PHOTO)
                .author(mainUser)
                .spot(spot3)
                .build();

        spotMediaRepository.save(media1);
        spotMediaRepository.save(media2);
        spotMediaRepository.save(media3);

        favoriteSpotRepository.save(FavoriteSpot.builder()
                .user(mainUser)
                .spot(spot1)
                .type(FavoriteSpotsListType.FAVORITE)
                .build());

        favoriteSpotRepository.save(FavoriteSpot.builder()
                .user(mainUser)
                .spot(spot2)
                .type(FavoriteSpotsListType.FAVORITE)
                .build());

        favoriteSpotRepository.save(FavoriteSpot.builder()
                .user(mainUser)
                .spot(spot3)
                .type(FavoriteSpotsListType.PLAN_TO_VISIT)
                .build());

        var comment1 = SpotComment.builder()
                .author(mainUser)
                .spot(spot1)
                .text("Świetne miejsce na spacer!")
                .rating(4.5)
                .build();

        var comment2 = SpotComment.builder()
                .author(mainUser)
                .spot(spot2)
                .text("Fajne, ale w weekendy tłoczno.")
                .rating(3.5)
                .build();

        var comment3 = SpotComment.builder()
                .author(friend1)
                .spot(spot1)
                .text("Byłem tu z rodziną, bardzo polecam.")
                .rating(5.0)
                .build();

        spotCommentRepository.save(comment1);
        spotCommentRepository.save(comment2);
        spotCommentRepository.save(comment3);

        friendshipRepository.save(
                Friendship.builder()
                        .user(mainUser)
                        .friend(friend1)
                        .status(UserFriendStatus.ACCEPTED)
                        .build()
        );
        friendshipRepository.save(
                Friendship.builder()
                        .user(mainUser)
                        .friend(friend2)
                        .status(UserFriendStatus.ACCEPTED)
                        .build()
        );
        friendshipRepository.save(
                Friendship.builder()
                        .user(mainUser)
                        .friend(friend3)
                        .status(UserFriendStatus.ACCEPTED)
                        .build()
        );
        friendshipRepository.save(
                Friendship.builder()
                        .user(mainUser)
                        .friend(friend4)
                        .status(UserFriendStatus.PENDING_SENT)
                        .build()
        );
        friendshipRepository.save(
                Friendship.builder()
                        .user(friend4)
                        .friend(mainUser)
                        .status(UserFriendStatus.PENDING_RECEIVED)
                        .build()
        );


        var loginDto = new UserLoginDto("testuser", "testpass");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        var request = new HttpEntity<>(loginDto, headers);

        var response = restTemplate.postForEntity(
                "http://localhost:" + port + "/public/account/login",
                request,
                String.class
        );

        jwtCookieHeader = response.getHeaders().getFirst("Set-Cookie");
        assertThat(jwtCookieHeader).contains("JWT_token");
    }

    // ---------- PROFILE ----------

    @Test
    @DisplayName("GET /user-dashboard/profile - should return own user profile")
    void getUserOwnProfile_shouldReturnOwnProfile() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/profile",
                HttpMethod.GET,
                entity,
                UserProfileDto.class
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body).isNotNull(),
                () -> assertThat(body.username()).isEqualTo("testuser"));
    }

    @Test
    @DisplayName("GET /public/user-dashboard/profile/{targetUsername} - should return profile for viewer")
    void getUserProfileForViewer_shouldReturnProfileForGivenUsername() {
        HttpHeaders headers = new HttpHeaders();
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/public/user-dashboard/profile/{username}",
                HttpMethod.GET,
                entity,
                ExtendedUserProfileDto.class,
                "testuser"
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body).isNotNull(),
                () -> assertThat(body.profile().username()).isEqualTo("testuser"));
    }

    @Test
    @DisplayName("PATCH /user-dashboard/profile - should change user profile photo")
    void changeUserProfilePhoto_shouldUpdateProfilePhoto() {
        HttpHeaders getHeaders = new HttpHeaders();
        getHeaders.add("Cookie", jwtCookieHeader);
        var getEntity = new HttpEntity<Void>(getHeaders);

        var initialResponse = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/profile",
                HttpMethod.GET,
                getEntity,
                UserProfileDto.class
        );

        var initialBody = initialResponse.getBody();

        assertAll(() -> assertThat(initialResponse.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(initialBody).isNotNull());

        var oldPhotoUrl = initialBody.profilePhoto();

        var fakeImageBytes = "fake image content".getBytes();

        var multipartBody = new LinkedMultiValueMap<String, Object>();
        multipartBody.add("profilePhoto",
                new ByteArrayResource(fakeImageBytes) {
                    @Override
                    public String getFilename() {
                        return "avatar.png";
                    }
                }
        );

        HttpHeaders patchHeaders = new HttpHeaders();
        patchHeaders.add("Cookie", jwtCookieHeader);
        patchHeaders.setContentType(MediaType.MULTIPART_FORM_DATA);

        var patchEntity = new HttpEntity<>(multipartBody, patchHeaders);

        var patchResponse = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/profile",
                HttpMethod.PATCH,
                patchEntity,
                Void.class
        );

        assertThat(patchResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        var finalResponse = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/profile",
                HttpMethod.GET,
                getEntity,
                UserProfileDto.class
        );

        var finalBody = finalResponse.getBody();

        assertAll(
                () -> assertThat(finalResponse.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(finalBody).isNotNull(),
                () -> assertThat(finalBody.profilePhoto()).isNotNull(),
                () -> assertThat(finalBody.profilePhoto()).isNotEqualTo(oldPhotoUrl)
        );
    }

    // ---------- FRIENDS / FOLLOWERS / FOLLOWED ----------

    @Test
    @DisplayName("GET /user-dashboard/friends - should return own friends page")
    void getUserOwnFriends_shouldReturnFriendsPage() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/friends",
                HttpMethod.GET,
                entity,
                SocialPageDto.class
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body.items()).isNotNull(),
                () -> assertThat(body.items()).hasSize(3),
                () -> assertThat(body.items().getFirst().username()).isEqualTo("friend1"));
    }

    @Test
    @DisplayName("GET /public/user-dashboard/friends/{targetUsername} - should return friends for viewer")
    void getUserFriendsForViewer_shouldReturnFriendsForTargetUser() {
        HttpHeaders headers = new HttpHeaders();
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/public/user-dashboard/friends/{username}",
                HttpMethod.GET,
                entity,
                SocialPageDto.class,
                "testuser"
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body.items()).isNotNull(),
                () -> assertThat(body.items()).hasSize(3),
                () -> assertThat(body.items().getFirst().username()).isEqualTo("friend1"));
    }

    @Test
    @DisplayName("PATCH /user-dashboard/friends - should edit user friends relation")
    void editUserFriends_shouldEditFriendRelation() {
        var before = friendshipRepository.findByUserAndFriend(mainUser,
                userEntityRepository.findByUsername("friend1").orElseThrow());
        assertThat(before).isPresent();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        String url = "http://localhost:" + port
                + "/user-dashboard/friends"
                + "?friendUsername=friend1"
                + "&type=REMOVE";

        var response = restTemplate.exchange(
                url,
                HttpMethod.PATCH,
                entity,
                Void.class
        );

        var after = friendshipRepository.findByUserAndFriend(mainUser,
                userEntityRepository.findByUsername("friend1").orElseThrow());

        assertAll(
                () -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(after).isEmpty()
        );
    }

    @Test
    @DisplayName("PATCH /user-dashboard/friends/change-status - should change friend status")
    void changeUserFriendsStatus_shouldChangeFriendStatus() {
        var before = friendshipRepository.findByUserAndFriend(mainUser,
                userEntityRepository.findByUsername("friend4").orElseThrow());
        assertThat(before).isPresent();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        String url = "http://localhost:" + port
                + "/user-dashboard/friends/change-status"
                + "?friendUsername=friend4"
                + "&status=ACCEPTED";

        var response = restTemplate.exchange(
                url,
                HttpMethod.PATCH,
                entity,
                Void.class
        );

        var after = friendshipRepository.findByUserAndFriend(mainUser,
                userEntityRepository.findByUsername("friend4").orElseThrow());

        assertAll(
                () -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(after.get().getStatus()).isEqualTo(UserFriendStatus.ACCEPTED)
        );
    }

    @Test
    @DisplayName("GET /user-dashboard/followers - should return own followers page")
    void getUserOwnFollowers_shouldReturnFollowersPage() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/followers",
                HttpMethod.GET,
                entity,
                SocialPageDto.class
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body.items()).isNotNull(),
                () -> assertThat(body.items()).isEmpty());
    }

    @Test
    @DisplayName("GET /public/user-dashboard/followers/{targetUsername} - should return followers for viewer")
    void getUserFollowersForViewer_shouldReturnFollowersForTargetUser() {
        HttpHeaders headers = new HttpHeaders();
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/public/user-dashboard/followers/{username}",
                HttpMethod.GET,
                entity,
                SocialPageDto.class,
                "testuser"
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body.items()).isNotNull(),
                () -> assertThat(body.items()).isEmpty());
    }

    @Test
    @DisplayName("GET /user-dashboard/followed - should return own followed users page")
    void getUserOwnFollowed_shouldReturnFollowedPage() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/followed",
                HttpMethod.GET,
                entity,
                SocialPageDto.class
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body.items()).isNotNull(),
                () -> assertThat(body.items()).isEmpty());
    }

    @Test
    @DisplayName("GET /public/user-dashboard/followed/{targetUsername} - should return followed for viewer")
    void getUserFollowedForViewer_shouldReturnFollowedForTargetUser() {
        HttpHeaders headers = new HttpHeaders();
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/public/user-dashboard/followed/{username}",
                HttpMethod.GET,
                entity,
                SocialPageDto.class,
                "testuser"
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body.items()).isNotNull(),
                () -> assertThat(body.items()).isEmpty());
    }

    @Test
    @DisplayName("GET /user-dashboard/friends/find - should search users by username")
    void searchUsersByUsername_shouldReturnSearchResults() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/friends/find?query=friend",
                HttpMethod.GET,
                entity,
                SocialPageDto.class
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body.items()).isNotNull(),
                () -> assertThat(body.items()).hasSize(4),
                () -> assertThat(body.items().getFirst().username()).isEqualTo("friend1"));
    }

    @Test
    @DisplayName("GET /user-dashboard/friends/invites - should return all friend invites")
    void getAllFriendInvites_shouldReturnInvitesPage() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/friends/invites",
                HttpMethod.GET,
                entity,
                SocialPageDto.class
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body.items()).isEmpty());
    }

    @Test
    @DisplayName("PATCH /user-dashboard/followed - should edit followed users")
    void editUserFollowed_shouldEditFollowedRelation() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        var beforeResp = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/followed",
                HttpMethod.GET,
                entity,
                SocialPageDto.class
        );
        assertAll(() -> assertThat(beforeResp.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(beforeResp.getBody().items()).isEmpty());

        String url = "http://localhost:" + port
                + "/user-dashboard/followed"
                + "?followedUsername=friend1"
                + "&type=ADD";

        var patchResp = restTemplate.exchange(
                url,
                HttpMethod.PATCH,
                entity,
                Void.class
        );
        assertThat(patchResp.getStatusCode()).isEqualTo(HttpStatus.OK);

        var afterResp = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/followed",
                HttpMethod.GET,
                entity,
                SocialPageDto.class
        );
        assertAll(() -> assertThat(afterResp.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(afterResp.getBody().items())
                        .extracting("username")
                        .contains("friend1"));
    }

    // ---------- FAVORITE SPOTS ----------

    @Test
    @DisplayName("GET /user-dashboard/favorite-spots - should return favorite spots page")
    void getAllUserFavoritesSpots_shouldReturnFavoriteSpots() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/favorite-spots?type=FAVORITE",
                HttpMethod.GET,
                entity,
                FavoriteSpotPageDto.class
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body.items()).isNotNull(),
                () -> assertThat(body.items()).hasSize(2),
                () -> assertThat(body.items().getFirst().name()).isEqualTo("Spot 1"));
    }

    @Test
    @DisplayName("PATCH /user-dashboard/favorite-spots - should edit favorite spot list")
    void editFavoriteSpotList_shouldEditFavoriteSpots() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        var beforeResponse = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/favorite-spots?type=FAVORITE",
                HttpMethod.GET,
                entity,
                FavoriteSpotPageDto.class
        );

        var beforeBody = beforeResponse.getBody();

        assertAll(
                () -> assertThat(beforeResponse.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(beforeBody).isNotNull(),
                () -> assertThat(beforeBody.items()).hasSize(2)
        );

        String url = "http://localhost:" + port
                + "/user-dashboard/favorite-spots"
                + "?type=FAVORITE"
                + "&spotId=" + spot2.getId()
                + "&operationType=REMOVE";

        var patchResponse = restTemplate.exchange(
                url,
                HttpMethod.PATCH,
                entity,
                Void.class
        );

        assertThat(patchResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        var afterResponse = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/favorite-spots?type=FAVORITE",
                HttpMethod.GET,
                entity,
                FavoriteSpotPageDto.class
        );

        var afterBody = afterResponse.getBody();

        assertAll(
                () -> assertThat(afterResponse.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(afterBody).isNotNull(),
                () -> assertThat(afterBody.items()).hasSize(1),
                () -> assertThat(afterBody.items().getFirst().name()).isEqualTo("Spot 1")
        );
    }

    // ---------- MEDIA (PHOTOS / MOVIES / COMMENTS) ----------

    @Test
    @DisplayName("GET /user-dashboard/photos - should return sorted user photos")
    void getSortedUserPhotos_shouldReturnPhotosByDateSortType() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/photos?type=DATE_ASCENDING",
                HttpMethod.GET,
                entity,
                DatedMediaGroupPageDto.class
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body.items()).isNotNull(),
                () -> assertThat(body.items()).hasSize(1),
                () -> assertThat(body.items().getFirst().media().getFirst().heartsCount()).isZero());
    }

    @Test
    @DisplayName("GET /user-dashboard/movies - should return sorted user movies")
    void getSortedUserMovies_shouldReturnMoviesByDateSortType() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/movies?type=DATE_ASCENDING",
                HttpMethod.GET,
                entity,
                DatedMediaGroupPageDto.class
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body.items()).isNotNull(),
                () -> assertThat(body.items()).isEmpty());
    }

    @Test
    @DisplayName("GET /user-dashboard/comments - should return sorted user comments")
    void getSortedUserComments_shouldReturnCommentsByDateSortType() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/comments?type=DATE_ASCENDING",
                HttpMethod.GET,
                entity,
                DatedCommentsGroupPageDto.class
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body.items()).isNotNull(),
                () -> assertThat(body.items()).hasSize(2),
                () -> assertThat(body.items().getFirst().comments().getFirst().spotName()).isEqualTo("Spot 2"));
    }

    @Test
    @DisplayName("GET /public/user-dashboard/photos/{targetUsername} - should return all user photos for viewer")
    void getAllUserPhotos_shouldReturnPhotosForTargetUser() {
        HttpHeaders headers = new HttpHeaders();
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/public/user-dashboard/photos/{username}",
                HttpMethod.GET,
                entity,
                DatedMediaGroupPageDto.class,
                "testuser"
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body.items()).isNotNull(),
                () -> assertThat(body.items()).hasSize(1),
                () -> assertThat(body.items().getFirst().media().getFirst().heartsCount()).isZero());
    }

    // ---------- SETTINGS ----------

    @Test
    @DisplayName("PATCH /user-dashboard/settings - should edit user settings")
    void editUserSettings_shouldUpdateSettings() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        headers.setContentType(MediaType.APPLICATION_JSON);

        var editDto = new UserEditDataDto(
                null,
                null,
                "newusername",
                Provider.NONE,
                null,
                null,
                UserSettingsType.USERNAME
        );

        var patchEntity = new HttpEntity<>(editDto, headers);

        var patchResponse = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/settings",
                HttpMethod.PATCH,
                patchEntity,
                Void.class
        );

        assertThat(patchResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        var setCookieHeaders = patchResponse.getHeaders().get(HttpHeaders.SET_COOKIE);
        assertThat(setCookieHeaders).isNotNull();

        String newJwtCookie = setCookieHeaders.stream()
                .filter(c -> c.contains("JWT_token="))
                .findFirst()
                .orElseThrow(() -> new AssertionError("JWT_token cookie not found in Set-Cookie headers"));

        HttpHeaders getHeaders = new HttpHeaders();
        getHeaders.add("Cookie", newJwtCookie);
        var getEntity = new HttpEntity<Void>(getHeaders);

        var getResponse = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/settings",
                HttpMethod.GET,
                getEntity,
                UserDataDto.class
        );

        var body = getResponse.getBody();

        assertAll(
                () -> assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body).isNotNull(),
                () -> assertThat(body.username()).isEqualTo("newusername"),
                () -> assertThat(body.email()).isEqualTo("test@example.com"),
                () -> assertThat(body.provider()).isEqualTo(Provider.NONE)
        );
    }


    @Test
    @DisplayName("GET /user-dashboard/settings - should return user data")
    void getUserData_shouldReturnUserSettingsData() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/settings",
                HttpMethod.GET,
                entity,
                UserDataDto.class
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body).isNotNull(),
                () -> assertThat(body.email()).isEqualTo("test@example.com"),
                () -> assertThat(body.username()).isEqualTo("testuser"),
                () -> assertThat(body.provider()).isEqualTo(Provider.NONE));
    }

    // ---------- ADD SPOT ----------

    @Test
    @DisplayName("GET /user-dashboard/add-spot - should return page of spots added by user")
    void getAllSpotsAddedByUser_shouldReturnAddedSpotsPage() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/add-spot",
                HttpMethod.GET,
                entity,
                AddSpotPageDto.class
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body).isNotNull(),
                () -> assertThat(body.items()).hasSize(3),
                () -> assertThat(body.items().getFirst().name()).isEqualTo("Spot 3"));
    }

    @Test
    @DisplayName("POST /user-dashboard/add-spot - should add new spot with media")
    void addSpot_shouldCreateNewSpotWithMedia() {
        HttpHeaders beforeHeaders = new HttpHeaders();
        beforeHeaders.add("Cookie", jwtCookieHeader);
        var beforeEntity = new HttpEntity<Void>(beforeHeaders);

        var beforeResponse = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/add-spot",
                HttpMethod.GET,
                beforeEntity,
                AddSpotPageDto.class
        );

        var beforeBody = beforeResponse.getBody();

        assertAll(
                () -> assertThat(beforeResponse.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(beforeBody).isNotNull(),
                () -> assertThat(beforeBody.items()).hasSize(3)
        );

        String spotJson = """
            {
              "name": "New Test Spot",
              "description": "Test description",
              "country": "Country X",
              "region": "Region X",
              "city": "City X",
              "street": "Street X",
              "borderPoints": [
                { "x": 40.790000, "y": -73.980000 },
                { "x": 40.791000, "y": -73.981000 }
              ]
            }
            """;

        var fakeImageBytes = "fake image content for new spot".getBytes();

        var multipartBody = new LinkedMultiValueMap<String, Object>();

        multipartBody.add("spot", spotJson);

        multipartBody.add("media",
                new ByteArrayResource(fakeImageBytes) {
                    @Override
                    public String getFilename() {
                        return "new-spot-photo.png";
                    }
                }
        );

        HttpHeaders postHeaders = new HttpHeaders();
        postHeaders.add("Cookie", jwtCookieHeader);
        postHeaders.setContentType(MediaType.MULTIPART_FORM_DATA);

        var postEntity = new HttpEntity<>(multipartBody, postHeaders);

        var postResponse = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/add-spot",
                HttpMethod.POST,
                postEntity,
                Void.class
        );

        assertThat(postResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        var afterResponse = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/add-spot",
                HttpMethod.GET,
                beforeEntity,
                AddSpotPageDto.class
        );

        var afterBody = afterResponse.getBody();

        assertAll(
                () -> assertThat(afterResponse.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(afterBody).isNotNull(),
                () -> assertThat(afterBody.items()).hasSize(4),
                () -> assertThat(afterBody.items())
                        .extracting("name")
                        .contains("New Test Spot")
        );
    }

    // ---------- COORDINATES ----------

    @Test
    @DisplayName("GET /user-dashboard/add-spot/coordinates - should return coordinates for query")
    void getCoordinates_shouldReturnBorderPointMono() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cookie", jwtCookieHeader);
        var entity = new HttpEntity<Void>(headers);

        var response = restTemplate.exchange(
                "http://localhost:" + port + "/user-dashboard/add-spot/coordinates?query=warsaw",
                HttpMethod.GET,
                entity,
                BorderPoint.class
        );

        var body = response.getBody();

        assertAll(() -> assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK),
                () -> assertThat(body).isNotNull(),
                () -> assertThat(body.getX()).isEqualTo(21.0067249),
                () -> assertThat(body.getY()).isEqualTo(52.2319581));
    }
}
