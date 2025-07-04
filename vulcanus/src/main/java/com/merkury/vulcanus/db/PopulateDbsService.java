package com.merkury.vulcanus.db;

import com.merkury.vulcanus.model.embeddable.BorderPoint;
import com.merkury.vulcanus.model.entities.SpotComment;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.entities.PasswordResetToken;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.Zone;
import com.merkury.vulcanus.model.entities.*;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.repositories.*;
import com.merkury.vulcanus.utils.PolygonAreaCalculator;
import com.merkury.vulcanus.utils.PolygonCenterPointCalculator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.merkury.vulcanus.model.enums.UserRole.ROLE_ADMIN;
import static com.merkury.vulcanus.model.enums.UserRole.ROLE_USER;
import static java.util.Arrays.asList;

@Service
@RequiredArgsConstructor
public class PopulateDbsService {
    private final PasswordEncoder passwordEncoder;
    private final UserEntityRepository userEntityRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final SpotRepository spotRepository;
    private final ZoneRepository zoneRepository;
    private final SpotTagRepository spotTagRepository;
    private final SpotCommentRepository spotCommentRepository;

    @Transactional
    public void initPostgresDb() {
        UserEntity admin = UserEntity.builder()
                .email("admin@example.com")
                .username("admin")
                .password(passwordEncoder.encode("password"))
                .userRole(ROLE_ADMIN)
                .provider(Provider.NONE)
                .build();

        UserEntity user = UserEntity.builder()
                .email("user@example.com")
                .username("user")
                .password(passwordEncoder.encode("password"))
                .userRole(ROLE_USER)
                .provider(Provider.NONE)
                .profilePhoto("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
                .build();

        for (int i = 0; i < 10; i++) {
            UserEntity locustUser = UserEntity.builder()
                    .email("user" + i + "@example.com")
                    .username("user" + i)
                    .password(passwordEncoder.encode("password"))
                    .userRole(ROLE_USER)
                    .provider(Provider.NONE)
                    .build();

            userEntityRepository.save(locustUser);
        }

        userEntityRepository.save(admin);
        userEntityRepository.save(user);

        var token = PasswordResetToken.builder()
                .token(UUID.fromString("fff3a3f6-fbd8-4fc5-890c-626343f2f324"))
                .expirationDate(LocalDateTime.now().plusMinutes(15))
                .userEmail(user.getEmail())
                .build();

        passwordResetTokenRepository.save(token);

        Spot spot1 = Spot.builder()
                .name("Pomnik konny Jana III Sobieskiego")
                .city("Gdańsk")
                .country("Poland")
                .street("Targ Drzewny 9")
                .areaColor("#A8071A")
                .description("Brązowy posąg XVII-wiecznego polskiego króla Jana III Sobieskiego na koniu usytuowany na małym placu.")
                .rating(5.0)
                .ratingCount(25)
                .images(new ArrayList<>())
                .tags(new HashSet<>())
                .build();

        Spot spot2 = Spot.builder()
                .name("Skwer Czesława Niemena")
                .city("Gdańsk")
                .country("Poland")
                .street("Hucisko")
                .areaColor("#A8071A")
                .description("Mały park z ławkami i pomnikiem Czesława Niemena.")
                .rating(5.0)
                .ratingCount(25)
                .images(new ArrayList<>())
                .tags(new HashSet<>())
                .build();

        Spot spot3 = Spot.builder()
                .name("Park Wałowy")
                .city("Gdańsk")
                .country("Poland")
                .street("Pod Zrębem 1")
                .areaColor("#A8071A")
                .description("Mały park z ławkami")
                .rating(3.5)
                .ratingCount(20)
                .images(new ArrayList<>())
                .tags(new HashSet<>())
                .build();

        Spot spot4 = Spot.builder()
                .name("Park księdza infułata Bogdanowicza")
                .city("Gdańsk")
                .country("Poland")
                .street("Szeroka 8/10")
                .areaColor("#A8071A")
                .description("Mały park")
                .rating(3.6)
                .ratingCount(15)
                .images(new ArrayList<>())
                .tags(new HashSet<>())
                .build();

        Spot spot5 = Spot.builder()
                .name("Jar Wilanowski")
                .city("Gdańsk")
                .country("Poland")
                .street("Antoniego Madalińskiego")
                .areaColor("#A8071A")
                .description("Zielona strefa z jeziorem")
                .rating(4.6)
                .ratingCount(8)
                .images(new ArrayList<>())
                .tags(new HashSet<>())
                .build();

        Spot spot6 = Spot.builder()
                .name("Plac imienia Dariusza Kobzdeja")
                .city("Gdańsk")
                .country("Poland")
                .street("Podwale Staromiejskie 109/112b")
                .areaColor("#A8071A")
                .description("Mały, zadbany plac z ławeczkami i zielenią. Znajduje się on z jednej strony w pobliżu pomnika Jana III Sobieskiego, a z drugiej strony w pobliżu Hali Targowej.")
                .rating(4.5)
                .ratingCount(1)
                .images(new ArrayList<>())
                .tags(new HashSet<>())
                .build();

        Spot spot7 = Spot.builder()
                .name("Plac Zabaw na Wroniej Górce")
                .city("Gdańsk")
                .country("Poland")
                .street("Marszałka Ferdynanda Focha")
                .areaColor("#A8071A")
                .description("Plac zabaw")
                .rating(4.8)
                .ratingCount(99)
                .images(new ArrayList<>())
                .tags(new HashSet<>())
                .build();

        Spot spot8 = Spot.builder()
                .name("Plaża stogi")
                .city("Gdańsk")
                .country("Poland")
                .street("Wydmy 1")
                .areaColor("#A8071A")
                .description("Szeroka piaszczysta plaża.")
                .rating(4.6)
                .ratingCount(25)
                .images(new ArrayList<>())
                .tags(new HashSet<>())
                .build();

        Spot spot9 = Spot.builder()
                .name("Park Oruński im. Emilii Hoene")
                .city("Gdańsk")
                .country("Poland")
                .street("Raduńska 44A")
                .areaColor("#A8071A")
                .description("Park Oruński należy, obok Parku Oliwskiego, należy do najcenniejszych zachowanych dawnych gdańskich parków.")
                .rating(5.0)
                .ratingCount(25)
                .images(new ArrayList<>())
                .tags(new HashSet<>())
                .build();

        Spot spot10 = Spot.builder()
                .name("Park Street Workout")
                .city("Gdańsk")
                .country("Poland")
                .street("Związkowa")
                .areaColor("#A8071A")
                .description("Park, który oryginalnie był cmentarzem protestanckim, należącym dawniej do kościoła przy placu Oruńskim.")
                .rating(4.4)
                .ratingCount(25)
                .images(new ArrayList<>())
                .tags(new HashSet<>())
                .build();

        var contour1 = asList(
                new BorderPoint(54.352223, 18.647865),
                new BorderPoint(54.352293, 18.648729),
                new BorderPoint(54.35217, 18.64886),
                new BorderPoint(54.351863, 18.648476),
                new BorderPoint(54.352127, 18.647795),
                new BorderPoint(54.352223, 18.647865)
        );

        var contour2 = asList(
                new BorderPoint(54.352541, 18.643992),
                new BorderPoint(54.35239, 18.64477),
                new BorderPoint(54.352299, 18.644891),
                new BorderPoint(54.352197, 18.645478),
                new BorderPoint(54.35207, 18.645385),
                new BorderPoint(54.352022, 18.643854),
                new BorderPoint(54.35215, 18.643724),
                new BorderPoint(54.352541, 18.643992)
        );

        var contour3 = asList(
                new BorderPoint(54.34259835347914, 18.646824493647234),
                new BorderPoint(54.34199917555038, 18.64785810853534),
                new BorderPoint(54.34195539522013, 18.647858779087542),
                new BorderPoint(54.34137469972922, 18.647210032866408),
                new BorderPoint(54.341541692733195, 18.646703124929658),
                new BorderPoint(54.341637055513615, 18.646738079025297),
                new BorderPoint(54.3419363403778, 18.646826492025596),
                new BorderPoint(54.342225666534006, 18.64683452957797),
                new BorderPoint(54.342545681638356, 18.646805949945094),
                new BorderPoint(54.34259835347914, 18.646824493647234)
        );

        var contour4 = asList(
                new BorderPoint(54.35165940763592, 18.648793774997493),
                new BorderPoint(54.351680293212745, 18.648745327233843),
                new BorderPoint(54.35183253332448, 18.648952025317534),
                new BorderPoint(54.35200919291976, 18.649438999131455),
                new BorderPoint(54.35199829573896, 18.649543918905415),
                new BorderPoint(54.35190059549554, 18.65002604593978),
                new BorderPoint(54.3514576317341, 18.649347464307972),
                new BorderPoint(54.351482643288136, 18.6492770563266),
                new BorderPoint(54.35164951686307, 18.649484927516383),
                new BorderPoint(54.35181742720021, 18.649007936786656),
                new BorderPoint(54.35165940763592, 18.648793774997493)
        );

        var contour5 = asList(
                new BorderPoint(54.33273052789799, 18.607928515378298),
                new BorderPoint(54.332883674817786, 18.602005681784895),
                new BorderPoint(54.33347676722585, 18.602138197080475),
                new BorderPoint(54.334165967969106, 18.604189842724054),
                new BorderPoint(54.33586429814381, 18.603372776749126),
                new BorderPoint(54.334469166558435, 18.60516083775306),
                new BorderPoint(54.33440784100703, 18.60914014998731),
                new BorderPoint(54.33273052789799, 18.607928515378298)
        );

        var contour6 = asList(
                new BorderPoint(54.35200732546214, 18.65021445366572),
                new BorderPoint(54.35220301624161, 18.649300832037643),
                new BorderPoint(54.35241008337719, 18.6493203538673),
                new BorderPoint(54.35301535055999, 18.650940665729063),
                new BorderPoint(54.35291068093288, 18.65109684036634),
                new BorderPoint(54.35275140055396, 18.651112457830067),
                new BorderPoint(54.35200960094167, 18.650202740567924),
                new BorderPoint(54.35200732546214, 18.65021445366572)
        );

        var contour7 = asList(
                new BorderPoint(54.358542876913596, 18.63203900299652),
                new BorderPoint(54.35822244612602, 18.630237221776515),
                new BorderPoint(54.35864173271596, 18.630079273422812),
                new BorderPoint(54.35918032221919, 18.629266131898195),
                new BorderPoint(54.359275767723744, 18.63173480616717),
                new BorderPoint(54.358542876913596, 18.63203900299652)
        );

        var contour8 = asList(
                new BorderPoint(54.38058274498329, 18.71852472241705),
                new BorderPoint(54.374571558766014, 18.734291452494816),
                new BorderPoint(54.374154434956594, 18.73390498116206),
                new BorderPoint(54.37588475304012, 18.726626367217193),
                new BorderPoint(54.37737805637779, 18.72191952735178),
                new BorderPoint(54.379948555376366, 18.717845650954484),
                new BorderPoint(54.38058274498329, 18.71852472241705)
        );

        var contour9 = asList(
                new BorderPoint(54.3230684167437, 18.629913718953556),
                new BorderPoint(54.32202382781201, 18.629940753924505),
                new BorderPoint(54.321889803154754, 18.629704197939827),
                new BorderPoint(54.32202382780555, 18.628724180242937),
                new BorderPoint(54.321909512689615, 18.628399760591552),
                new BorderPoint(54.32186220979011, 18.627473812836563),
                new BorderPoint(54.32089248834232, 18.62753464135538),
                new BorderPoint(54.3208727783163, 18.622553447736156),
                new BorderPoint(54.323001406164785, 18.62577736810166),
                new BorderPoint(54.3230684167437, 18.629913718953556)
        );

        var contour10 = asList(
                new BorderPoint(54.32202428469449, 18.63395637969597),
                new BorderPoint(54.321451089176406, 18.633757481769084),
                new BorderPoint(54.321451089176406, 18.635939509025782),
                new BorderPoint(54.3218434560184, 18.635892709513577),
                new BorderPoint(54.32184686788757, 18.63498011902552),
                new BorderPoint(54.322051004640734, 18.634962421442747),
                new BorderPoint(54.32203140614784, 18.633959822968333),
                new BorderPoint(54.32202428469449, 18.63395637969597)
        );

        List<SpotComment> spotCommentList1 = new ArrayList<>(asList(
                SpotComment.builder()
                        .text("Świetne miejsce, warto odwiedzić!")
                        .rating(5.0)
                        .spot(spot1)
                        .publishDate(LocalDateTime.of(2025, 6, 1, 10, 15))
                        .author(user)
                        .build(),
                SpotComment.builder()
                        .text("Było fajnie, choć spodziewałem się więcej.")
                        .rating(4.0)
                        .spot(spot1)
                        .publishDate(LocalDateTime.of(2024, 6, 2, 14, 30))
                        .author(user)
                        .build()
        ));

        List<SpotComment> spotCommentList2 = new ArrayList<>(asList(
                SpotComment.builder()
                        .text("Idealne miejsce na relaks.")
                        .rating(5.0)
                        .spot(spot2)
                        .publishDate(LocalDateTime.of(2024, 6, 3, 9, 45))
                        .author(user)
                        .build(),
                SpotComment.builder()
                        .text("Widoki niezłe, ale tłoczno i głośno.")
                        .rating(3.0)
                        .spot(spot2)
                        .publishDate(LocalDateTime.of(2024, 6, 4, 16, 20))
                        .author(user)
                        .build()
        ));

        List<SpotComment> spotCommentList3 = new ArrayList<>(asList(
                SpotComment.builder()
                        .text("Czysto, spokojnie i klimatycznie.")
                        .rating(5.0)
                        .spot(spot3)
                        .publishDate(LocalDateTime.of(2024, 6, 5, 8, 10))
                        .author(user)
                        .build(),
                SpotComment.builder()
                        .text("Trochę zbyt mało atrakcji jak dla mnie.")
                        .rating(3.5)
                        .spot(spot3)
                        .publishDate(LocalDateTime.of(2024, 6, 6, 18, 55))
                        .author(user)
                        .build()
        ));

        List<SpotComment> spotCommentList4 = new ArrayList<>(asList(
                SpotComment.builder()
                        .text("Miejsce warte odwiedzenia, polecam.")
                        .rating(4.5)
                        .spot(spot4)
                        .publishDate(LocalDateTime.of(2024, 6, 7, 11, 40))
                        .author(user)
                        .build(),
                SpotComment.builder()
                        .text("Atmosfera w porządku, ale spodziewałem się więcej zieleni.")
                        .rating(3.0)
                        .spot(spot4)
                        .publishDate(LocalDateTime.of(2024, 6, 8, 13, 25))
                        .author(user)
                        .build()
        ));

        List<SpotComment> spotCommentList5 = new ArrayList<>(asList(
                SpotComment.builder()
                        .text("Rewelacyjne miejsce na wycieczkę!")
                        .rating(5.0)
                        .spot(spot5)
                        .publishDate(LocalDateTime.of(2024, 6, 9, 7, 50))
                        .author(user)
                        .build(),
                SpotComment.builder()
                        .text("Dobre miejsce, ale trochę za drogo jak na jakość.")
                        .rating(4.0)
                        .spot(spot5)
                        .publishDate(LocalDateTime.of(2024, 6, 10, 20, 15))
                        .author(user)
                        .build()
        ));

        List<SpotComment> spotCommentList6 = new ArrayList<>(asList(
                SpotComment.builder()
                        .text("Wspaniałe widoki, aż chce się wracać.")
                        .rating(5.0)
                        .spot(spot6)
                        .publishDate(LocalDateTime.of(2024, 6, 11, 15, 30))
                        .author(user)
                        .build(),
                SpotComment.builder()
                        .text("Było przyjemnie, choć obsługa mogłaby być milsza.")
                        .rating(4.0)
                        .spot(spot6)
                        .publishDate(LocalDateTime.of(2024, 6, 12, 19, 5))
                        .author(user)
                        .build()
        ));

        List<SpotComment> spotCommentList7 = new ArrayList<>(asList(
                SpotComment.builder()
                        .text("Bardzo ciekawe miejsce z historią.")
                        .rating(5.0)
                        .spot(spot7)
                        .publishDate(LocalDateTime.of(2024, 6, 13, 12, 10))
                        .author(user)
                        .build(),
                SpotComment.builder()
                        .text("Miejsce okej, ale parking był problematyczny.")
                        .rating(3.5)
                        .spot(spot7)
                        .publishDate(LocalDateTime.of(2024, 6, 14, 14, 50))
                        .author(user)
                        .build()
        ));

        List<SpotComment> spotCommentList8 = new ArrayList<>(asList(
                SpotComment.builder()
                        .text("Czyste i dobrze zorganizowane miejsce.")
                        .rating(4.5)
                        .spot(spot8)
                        .publishDate(LocalDateTime.of(2024, 6, 15, 9, 0))
                        .author(user)
                        .build(),
                SpotComment.builder()
                        .text("Naprawdę wyjątkowe miejsce, choć trochę za dużo ludzi.")
                        .rating(4.0)
                        .spot(spot8)
                        .publishDate(LocalDateTime.of(2024, 6, 16, 18, 45))
                        .author(user)
                        .build()
        ));

        List<SpotComment> spotCommentList9 = new ArrayList<>(asList(
                SpotComment.builder()
                        .text("Super miejsce na rodzinny wypad.")
                        .rating(5.0)
                        .spot(spot9)
                        .publishDate(LocalDateTime.of(2024, 6, 17, 8, 30))
                        .author(user)
                        .build(),
                SpotComment.builder()
                        .text("Nie najgorsze, ale brakowało mi większych atrakcji.")
                        .rating(3.5)
                        .spot(spot9)
                        .publishDate(LocalDateTime.of(2024, 6, 18, 21, 10))
                        .author(user)
                        .build()
        ));

        List<SpotComment> spotCommentList10 = new ArrayList<>(asList(
                SpotComment.builder()
                        .text("Miejsce godne polecenia, świetna organizacja.")
                        .rating(5.0)
                        .spot(spot10)
                        .publishDate(LocalDateTime.of(2024, 6, 19, 10, 20))
                        .author(user)
                        .build(),
                SpotComment.builder()
                        .text("Podobało mi się, choć były drobne niedociągnięcia.")
                        .rating(4.5)
                        .spot(spot10)
                        .publishDate(LocalDateTime.of(2024, 6, 20, 17, 35))
                        .author(user)
                        .build()
        ));

        for (int i = 0; i < 100; i++) {
            SpotComment spotComment = SpotComment.builder()
                    .text("Comment" + i + ": Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
                    .rating((i + 1.0) % 5.0)
                    .spot(spot1)
                    .publishDate(LocalDateTime.now().minusMonths(1))
                    .author(user)
                    .build();
            spotCommentList1.add(spotComment);
            spotCommentList2.add(spotComment);
            spotCommentList3.add(spotComment);
            spotCommentList4.add(spotComment);
            spotCommentList5.add(spotComment);
            spotCommentList6.add(spotComment);
            spotCommentList7.add(spotComment);
            spotCommentList8.add(spotComment);
            spotCommentList9.add(spotComment);
        }

        List<Img> gallery1 = Arrays.asList(
                new Img(null, "https://ucarecdn.com/05b5602d-034c-48c8-858b-783d1e91f7a0/spot1_1.JPG", "pomnik", "pomnik", 0, 0, LocalDate.of(2024, 1, 15), user, spot1),
                new Img(null, "https://ucarecdn.com/596cde77-8a6e-4d26-bc97-7283b300de21/spot1_2.jpg", "pomnik", "pomnik", 0, 0, LocalDate.of(2024, 1, 15), user, spot1),
                new Img(null, "https://ucarecdn.com/01f7d077-feb5-44d0-8fd4-85b31d8f0599/spot1_3.jpg", "pomnik", "pomnik", 0, 0, LocalDate.of(2024, 1, 15), user, spot1)
        );

        List<Img> gallery2 = Arrays.asList(
                new Img(null, "https://ucarecdn.com/1feba18a-10f0-48e5-b696-e224dad5b029/spot2_1.jpg", "skwer", "skwer", 0, 0, LocalDate.of(2024, 1, 15), user, spot2),
                new Img(null, "https://ucarecdn.com/6763a034-4e45-408a-8774-b87cb7f56101/spot2_2.JPG", "skwer", "skwer", 0, 0, LocalDate.of(2024, 1, 15), user, spot2),
                new Img(null, "https://ucarecdn.com/2a3f57dc-efea-48db-8cf6-7c07c067183d/spot2_3.jpg", "skwer", "skwer", 0, 0, LocalDate.of(2024, 1, 15), user, spot2)
        );

        List<Img> gallery3 = Arrays.asList(
                new Img(null, "https://ucarecdn.com/a5ddecb9-0111-46ac-bc5f-1d4096a32516/spot3_1.jpg", "park wałowy", "park wałowy", 0, 0, LocalDate.of(2024, 1, 15), user, spot3),
                new Img(null, "https://ucarecdn.com/7e3a3cf1-828f-4273-88b9-5720e5bcf66b/spot3_2.jpg", "park wałowy", "park wałowy", 0, 0, LocalDate.of(2024, 1, 15), user, spot3),
                new Img(null, "https://ucarecdn.com/eb10811c-6008-472f-8fc4-d451ce94a24c/spot3_3.jpg", "park wałowy", "park wałowy", 0, 0, LocalDate.of(2024, 1, 15), user, spot3)
        );

        List<Img> gallery4 = Arrays.asList(
                new Img(null, "https://ucarecdn.com/c2e16106-bc39-4a21-8fa7-ba4698dce9d4/spo4_1.jpg", "park", "park", 0, 0, LocalDate.of(2024, 4, 1), user, spot4),
                new Img(null, "https://ucarecdn.com/26d21e8c-1245-40ea-8993-552d153ca848/spot4_2.jpg", "park", "park", 0, 0, LocalDate.of(2024, 4, 1), user, spot4),
                new Img(null, "https://ucarecdn.com/200a7973-a31b-4141-8555-9d22bc278844/spo4_3.JPG", "park", "park", 0, 0, LocalDate.of(2024, 4, 1), user, spot4)
        );

        List<Img> gallery5 = Arrays.asList(
                new Img(null, "https://ucarecdn.com/f4309644-b223-453e-8057-5f09e65d1696/spot5_1.jpg", "jar", "jar", 0, 0, LocalDate.of(2024, 4, 1), user, spot5),
                new Img(null, "https://ucarecdn.com/0d377a31-4f59-48db-9406-5882543aa3fe/spot5_2.jpg", "jar", "jar", 0, 0, LocalDate.of(2024, 4, 1), user, spot5),
                new Img(null, "https://ucarecdn.com/df82c57a-c094-4dfa-b576-70335e815445/spot5_3.JPG", "jar", "jar", 0, 0, LocalDate.of(2024, 4, 1), user, spot5)
        );

        List<Img> gallery6 = Arrays.asList(
                new Img(null, "https://ucarecdn.com/06be92dc-dedf-43f6-9113-7cfc71613b4f/spot6_1.jpg", "plac kobzdeja", "plac kobzdeja", 0, 0, LocalDate.of(2024, 4, 1), user, spot6),
                new Img(null, "https://ucarecdn.com/39eb63bc-80bb-4e68-ab9e-d21287749059/spot6_2.jpg", "plac kobzdeja", "plac kobzdeja", 0, 0, LocalDate.of(2024, 4, 1), user, spot6),
                new Img(null, "https://ucarecdn.com/13d2b277-43d2-4c1c-a574-681d604fc375/spot6_3.JPG", "plac kobzdeja", "plac kobzdeja", 0, 0, LocalDate.of(2024, 4, 1), user, spot6)
        );

        List<Img> gallery7 = Arrays.asList(
                new Img(null, "https://ucarecdn.com/102abcdc-83cc-42e0-a29b-d0d95eb5b217/spot7_1.jpg", "wrona", "wrona", 0, 0, LocalDate.of(2024, 7, 5), user, spot7),
                new Img(null, "https://ucarecdn.com/85800ed8-b23d-420a-8e95-7398ab05f50d/spot7_2.jpg", "wrona", "wrona", 0, 0, LocalDate.of(2024, 7, 5), user, spot7),
                new Img(null, "https://ucarecdn.com/4b2a92d2-a93e-475f-999f-fe623313b4ee/spot7_3.jpg", "wrona", "wrona", 0, 0, LocalDate.of(2024, 7, 5), user, spot7)
        );

        List<Img> gallery8 = Arrays.asList(
                new Img(null, "https://ucarecdn.com/c5cd7b37-8db6-4e07-a994-46498c0b2664/spot8_1.jpg", "plaża", "plaża", 0, 0, LocalDate.of(2024, 7, 5), user, spot8),
                new Img(null, "https://ucarecdn.com/8bc8452c-4c56-470c-a83d-479c2b875780/spot8_2.jpg", "plaża", "plaża", 0, 0, LocalDate.of(2024, 7, 5), user, spot8),
                new Img(null, "https://ucarecdn.com/eae9e067-5eaa-423f-9dc4-d05fd44c37c3/spot8_3.jpg", "plaża", "plaża", 0, 0, LocalDate.of(2024, 7, 5), user, spot8)
        );

        List<Img> gallery9 = Arrays.asList(
                new Img(null, "https://ucarecdn.com/64caf404-2027-4936-90bd-da23b21be9cb/spot9_1.jpg", "orunia", "orunia", 0, 0, LocalDate.of(2024, 7, 5), user, spot9),
                new Img(null, "https://ucarecdn.com/7bb00711-f613-4088-ad46-05529b4d163d/spot9_2.jpg", "orunia", "orunia", 0, 0, LocalDate.of(2024, 7, 5), user, spot9),
                new Img(null, "https://ucarecdn.com/6486d2d0-76db-4a05-9f55-a159cd4840d8/spot9_3.jpg", "orunia", "orunia", 0, 0, LocalDate.of(2024, 7, 5), user, spot9)
        );

        List<Img> gallery10 = Arrays.asList(
                new Img(null, "https://ucarecdn.com/8baa2ff0-edac-4f65-8895-ca07ec622c91/spot10_1.jpg", "workout", "workout", 0, 0, LocalDate.of(2024, 10, 10), user, spot10),
                new Img(null, "https://ucarecdn.com/54bba112-783d-4b72-8b78-85a924a5aa51/spot10_2.jpg", "workout", "workout", 0, 0, LocalDate.of(2024, 10, 10), user, spot10)
        );

        List<Spot> spots = new ArrayList<>(List.of(spot1, spot2, spot3, spot4, spot5, spot6, spot7, spot8, spot9, spot10));
        var contours = List.of(contour1, contour2, contour3, contour4, contour5, contour6, contour7, contour8, contour9, contour10);
        List<List<SpotComment>> commentLists = List.of(spotCommentList1, spotCommentList2, spotCommentList3, spotCommentList4, spotCommentList5, spotCommentList6, spotCommentList7, spotCommentList8, spotCommentList9, spotCommentList10);
        List<List<Img>> galleries = List.of(gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, gallery7, gallery8, gallery9, gallery10);

        List<String> tagsNames = new ArrayList<>(List.of(
                "city",
                "countryside",
                "mountains",
                "forest",
                "park",
                "ruins",
                "lake",
                "river",
                "monument",
                "beach",
                "old town",
                "fpv",
                "photography",
                "grassland"
        ));
        List<SpotTag> tagList = new ArrayList<>();
        for (String tagName : tagsNames) {
            var tag = SpotTag.builder()
                    .name(tagName)
                    .spots(new HashSet<>())
                    .build();
            spotTagRepository.save(tag);
            tagList.add(tag);
        }

        for (int i = 0; i < spots.size(); i++) {
            Spot spot = spots.get(i);
            spot.getBorderPoints().addAll(contours.get(i));
            spot.getSpotComments().addAll(commentLists.get(i));
            spot.getImages().addAll(galleries.get(i));
            spot.setArea(PolygonAreaCalculator.calculateArea(spot.getBorderPoints().toArray(new BorderPoint[0])));
            spot.setCenterPoint(PolygonCenterPointCalculator.calculateCenterPoint(spot.getBorderPoints()));

            var comments = commentLists.get(i);
            var rating = comments.stream()
                    .mapToDouble(SpotComment::getRating)
                    .average()
                    .orElse(0.0);
            spot.setRating(BigDecimal.valueOf(rating).setScale(2, RoundingMode.HALF_UP).doubleValue());
        }

        spot1.getTags().addAll((Set.of(tagList.getFirst(), tagList.get(8), tagList.get(12))));
        spot2.getTags().addAll(Set.of(tagList.getFirst(), tagList.get(4), tagList.get(11), tagList.get(12)));
        spot3.getTags().addAll(Set.of(tagList.getFirst(), tagList.get(4), tagList.get(11), tagList.get(12)));
        spot4.getTags().addAll(Set.of(tagList.getFirst(), tagList.get(4), tagList.get(11), tagList.get(12)));
        spot5.getTags().addAll(Set.of(tagList.getFirst(), tagList.get(3), tagList.get(4), tagList.get(11), tagList.get(12)));
        spot6.getTags().addAll(Set.of(tagList.getFirst(), tagList.get(4), tagList.get(11), tagList.get(12)));
        spot7.getTags().addAll(Set.of(tagList.getFirst(), tagList.get(4), tagList.get(11), tagList.get(12)));
        spot8.getTags().addAll(Set.of(tagList.getFirst(), tagList.get(9), tagList.get(12)));
        spot9.getTags().addAll(Set.of(tagList.getFirst(), tagList.get(4), tagList.get(11), tagList.get(12)));
        spot10.getTags().addAll(Set.of(tagList.getFirst(), tagList.get(4), tagList.get(11), tagList.get(12)));

        for (Spot spot : spots) {
            SpotComment firstComment = spot.getSpotComments().get(0);
            List<SpotCommentPhoto> photos = spot.getImages().stream()
                    .map(img -> SpotCommentPhoto.builder()
                            .url(img.getUrl())
                            .spotComment(firstComment)
                            .build()
                    )
                    .collect(Collectors.toCollection(ArrayList::new));
            firstComment.setPhotos(photos);
            spotCommentRepository.save(firstComment);
        }

        spotRepository.saveAll(spots);

        var zone = Zone.builder()
                .name("Test Zone")
                .borderPoints(List.of(
                        new BorderPoint(54.362207, 18.626871),
                        new BorderPoint(54.357756, 18.629189),
                        new BorderPoint(54.359757, 18.642449)
                ))
                .build();

        zoneRepository.save(zone);
    }

}
