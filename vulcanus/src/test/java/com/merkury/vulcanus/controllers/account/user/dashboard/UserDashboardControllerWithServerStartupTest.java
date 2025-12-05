package com.merkury.vulcanus.controllers.account.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.add.spot.AddSpotPageDto;
import com.merkury.vulcanus.model.dtos.account.comments.DatedCommentsGroupPageDto;
import com.merkury.vulcanus.model.dtos.account.media.DatedMediaGroupPageDto;
import com.merkury.vulcanus.model.dtos.account.profile.ExtendedUserProfileDto;
import com.merkury.vulcanus.model.dtos.account.profile.UserProfileDto;
import com.merkury.vulcanus.model.dtos.account.settings.UserDataDto;
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
import com.merkury.vulcanus.model.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

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

        mainUser = userEntityRepository.save(mainUser);
        friend1 = userEntityRepository.save(friend1);
        friend2 = userEntityRepository.save(friend2);
        friend3 = userEntityRepository.save(friend3);

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
    void getUserOwnProfile_shouldReturnOwnProfile() throws Exception {
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
    void changeUserProfilePhoto_shouldUpdateProfilePhoto() throws Exception {
    }

    // ---------- FRIENDS / FOLLOWERS / FOLLOWED ----------

    @Test
    @DisplayName("GET /user-dashboard/friends - should return own friends page")
    void getUserOwnFriends_shouldReturnFriendsPage() throws Exception {
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
                () -> assertThat(body.items().size()).isEqualTo(3),
                () -> assertThat(body.items().getFirst().username()).isEqualTo("friend1"));
    }

    @Test
    @DisplayName("GET /public/user-dashboard/friends/{targetUsername} - should return friends for viewer")
    void getUserFriendsForViewer_shouldReturnFriendsForTargetUser() throws Exception {
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
                () -> assertThat(body.items().size()).isEqualTo(3),
                () -> assertThat(body.items().getFirst().username()).isEqualTo("friend1"));
    }

    @Test
    @DisplayName("PATCH /user-dashboard/friends - should edit user friends relation")
    void editUserFriends_shouldEditFriendRelation() throws Exception {
    }

    @Test
    @DisplayName("PATCH /user-dashboard/friends/change-status - should change friend status")
    void changeUserFriendsStatus_shouldChangeFriendStatus() throws Exception {
    }

    @Test
    @DisplayName("GET /user-dashboard/followers - should return own followers page")
    void getUserOwnFollowers_shouldReturnFollowersPage() throws Exception {
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
                () -> assertThat(body.items().size()).isEqualTo(0));
    }

    @Test
    @DisplayName("GET /public/user-dashboard/followers/{targetUsername} - should return followers for viewer")
    void getUserFollowersForViewer_shouldReturnFollowersForTargetUser() throws Exception {
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
                () -> assertThat(body.items().size()).isEqualTo(0));
    }

    @Test
    @DisplayName("GET /user-dashboard/followed - should return own followed users page")
    void getUserOwnFollowed_shouldReturnFollowedPage() throws Exception {
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
                () -> assertThat(body.items().size()).isEqualTo(0));
    }

    @Test
    @DisplayName("GET /public/user-dashboard/followed/{targetUsername} - should return followed for viewer")
    void getUserFollowedForViewer_shouldReturnFollowedForTargetUser() throws Exception {
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
                () -> assertThat(body.items().size()).isEqualTo(0));
    }

    @Test
    @DisplayName("GET /user-dashboard/friends/find - should search users by username")
    void searchUsersByUsername_shouldReturnSearchResults() throws Exception {
    }

    @Test
    @DisplayName("GET /user-dashboard/friends/invites - should return all friend invites")
    void getAllFriendInvites_shouldReturnInvitesPage() throws Exception {
    }

    @Test
    @DisplayName("PATCH /user-dashboard/followed - should edit followed users")
    void editUserFollowed_shouldEditFollowedRelation() throws Exception {
    }

    // ---------- FAVORITE SPOTS ----------

    @Test
    @DisplayName("GET /user-dashboard/favorite-spots - should return favorite spots page")
    void getAllUserFavoritesSpots_shouldReturnFavoriteSpots() throws Exception {
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
                () -> assertThat(body.items().size()).isEqualTo(2),
                ()-> assertThat(body.items().getFirst().name()).isEqualTo("Spot 1"));
    }

    @Test
    @DisplayName("PATCH /user-dashboard/favorite-spots - should edit favorite spot list")
    void editFavoriteSpotList_shouldEditFavoriteSpots() throws Exception {
    }

    // ---------- MEDIA (PHOTOS / MOVIES / COMMENTS) ----------

    @Test
    @DisplayName("GET /user-dashboard/photos - should return sorted user photos")
    void getSortedUserPhotos_shouldReturnPhotosByDateSortType() throws Exception {
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
                () -> assertThat(body.items().size()).isEqualTo(1),
                ()-> assertThat(body.items().getFirst().media().getFirst().heartsCount()).isEqualTo(0));
    }

    @Test
    @DisplayName("GET /user-dashboard/movies - should return sorted user movies")
    void getSortedUserMovies_shouldReturnMoviesByDateSortType() throws Exception {
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
                () -> assertThat(body.items().size()).isEqualTo(0));
    }

    @Test
    @DisplayName("GET /user-dashboard/comments - should return sorted user comments")
    void getSortedUserComments_shouldReturnCommentsByDateSortType() throws Exception {
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
                () -> assertThat(body.items().size()).isEqualTo(2),
                ()-> assertThat(body.items().getFirst().comments().getFirst().spotName()).isEqualTo("Spot 1"));
    }

    @Test
    @DisplayName("GET /public/user-dashboard/photos/{targetUsername} - should return all user photos for viewer")
    void getAllUserPhotos_shouldReturnPhotosForTargetUser() throws Exception {
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
                () -> assertThat(body.items().size()).isEqualTo(1),
                ()-> assertThat(body.items().getFirst().media().getFirst().heartsCount()).isEqualTo(0));
    }

    // ---------- SETTINGS ----------

    @Test
    @DisplayName("PATCH /user-dashboard/settings - should edit user settings")
    void editUserSettings_shouldUpdateSettings() throws Exception {
    }

    @Test
    @DisplayName("GET /user-dashboard/settings - should return user data")
    void getUserData_shouldReturnUserSettingsData() throws Exception {
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
    void getAllSpotsAddedByUser_shouldReturnAddedSpotsPage() throws Exception {
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
                () -> assertThat(body.items().size()).isEqualTo(3),
                () -> assertThat(body.items().getFirst().name()).isEqualTo("Spot 3"));
    }

    @Test
    @DisplayName("POST /user-dashboard/add-spot - should add new spot with media")
    void addSpot_shouldCreateNewSpotWithMedia() throws Exception {
    }

    // ---------- COORDINATES ----------

    @Test
    @DisplayName("GET /user-dashboard/add-spot/coordinates - should return coordinates for query")
    void getCoordinates_shouldReturnBorderPointMono() throws Exception {
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
