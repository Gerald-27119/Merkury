package com.merkury.vulcanus.db.services;

import com.merkury.vulcanus.model.embeddable.BorderPoint;
import com.merkury.vulcanus.model.entities.spot.SpotComment;
import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.entities.spot.SpotCommentMedia;
import com.merkury.vulcanus.model.entities.spot.SpotMedia;
import com.merkury.vulcanus.model.entities.spot.SpotTag;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import com.merkury.vulcanus.model.repositories.*;
import com.merkury.vulcanus.utils.PolygonAreaCalculator;
import com.merkury.vulcanus.utils.PolygonCenterPointCalculator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.Arrays.asList;

@Service
@RequiredArgsConstructor
public class PopulateMapService {

    private final SpotRepository spotRepository;
    private final UserEntityRepository userEntityRepository;
    private final SpotTagRepository spotTagRepository;
    private final SpotCommentRepository spotCommentRepository;

    @Transactional
    public void initMapData() {

        var user = userEntityRepository.findByUsername("user").orElseThrow();

        Spot spot1 = Spot.builder()
                .name("Pomnik konny Jana III Sobieskiego")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Poland")
                .street("Targ Drzewny 9")
                .areaColor("#A8071A")
                .description("Brązowy posąg XVII-wiecznego polskiego króla Jana III Sobieskiego na koniu usytuowany na małym placu.")
                .rating(5.0)
                .ratingCount(25)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot2 = Spot.builder()
                .name("Skwer Czesława Niemena")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Poland")
                .street("Hucisko")
                .areaColor("#A8071A")
                .description("Mały park z ławkami i pomnikiem Czesława Niemena.")
                .rating(5.0)
                .ratingCount(25)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot3 = Spot.builder()
                .name("Park Wałowy")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Poland")
                .street("Pod Zrębem 1")
                .areaColor("#A8071A")
                .description("Mały park z ławkami")
                .rating(3.5)
                .ratingCount(20)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot4 = Spot.builder()
                .name("Park księdza infułata Bogdanowicza")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Poland")
                .street("Szeroka 8/10")
                .areaColor("#A8071A")
                .description("Mały park")
                .rating(3.6)
                .ratingCount(15)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot5 = Spot.builder()
                .name("Jar Wilanowski")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Poland")
                .street("Antoniego Madalińskiego")
                .areaColor("#A8071A")
                .description("Zielona strefa z jeziorem")
                .rating(4.6)
                .ratingCount(8)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot6 = Spot.builder()
                .name("Plac imienia Dariusza Kobzdeja")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Poland")
                .street("Podwale Staromiejskie 109/112b")
                .areaColor("#A8071A")
                .description("Mały, zadbany plac z ławeczkami i zielenią. Znajduje się on z jednej strony w pobliżu pomnika Jana III Sobieskiego, a z drugiej strony w pobliżu Hali Targowej.")
                .rating(4.5)
                .ratingCount(1)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot7 = Spot.builder()
                .name("Plac Zabaw na Wroniej Górce")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Poland")
                .street("Marszałka Ferdynanda Focha")
                .areaColor("#A8071A")
                .description("Plac zabaw")
                .rating(4.8)
                .ratingCount(99)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot8 = Spot.builder()
                .name("Plaża stogi")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Poland")
                .street("Wydmy 1")
                .areaColor("#A8071A")
                .description("Szeroka piaszczysta plaża.")
                .rating(4.6)
                .ratingCount(25)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot9 = Spot.builder()
                .name("Park Oruński im. Emilii Hoene")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Poland")
                .street("Raduńska 44A")
                .areaColor("#A8071A")
                .description("Park Oruński należy, obok Parku Oliwskiego, należy do najcenniejszych zachowanych dawnych gdańskich parków.")
                .rating(5.0)
                .ratingCount(25)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot10 = Spot.builder()
                .name("Park Street Workout")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Poland")
                .street("Związkowa")
                .areaColor("#A8071A")
                .description("Park, który oryginalnie był cmentarzem protestanckim, należącym dawniej do kościoła przy placu Oruńskim.")
                .rating(4.4)
                .ratingCount(25)
                .author(user)
                .timeZone("Europe/Warsaw")
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
                        .publishDate(LocalDateTime.of(2024, 6, 19, 17, 35))
                        .author(user)
                        .build()
        ));

        for (int i = 0; i < 100; i++) {
            var spotComment = SpotComment.builder()
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

        List<SpotMedia> spotMedia1 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/8d00d2e1-203e-4b90-bf0b-893f77f870ee.JPG", "pomnik", "pomnik", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot1, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/1299333c-ad54-4a2a-b6dc-4578ed4327dc.jpg", "pomnik", "pomnik", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot1, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/299fd24d-2436-4b51-bfdf-cbe728890198.jpg", "pomnik", "pomnik", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot1, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/98946961-ccce-4bbc-bd78-38df283297e3.jpg", "pomnik", "pomnik", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot1, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/f87aa3e3-fbc4-4371-837d-d10a4b6878a1.jpg", "pomnik", "pomnik", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot1, new HashSet<>())
        );

        List<SpotMedia> spotMedia2 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/b9744843-8cca-4e65-b677-bc89fbed9deb.jpg", "skwer", "skwer", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot2, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/562487b0-a975-4293-8c0f-aaa605f6cd77.JPG", "skwer", "skwer", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot2, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/04bfa588-77c3-4e46-bdf8-f6bb677f845d.jpg", "skwer", "skwer", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot2, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/b6d1364b-97d8-4bf1-b279-12664ac274fb.jpg", "skwer", "skwer", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot2, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/be341380-eb45-416e-bf60-0e80fed250bf.jpg", "skwer", "skwer", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot2, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/f5e1a392-a768-4f9e-9b30-98f1a01c48ae.jpg", "skwer", "skwer", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot2, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/9eeb8808-6165-4a9d-a864-9f11b5588b69.jpg", "skwer", "skwer", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot2, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/5f1ff331-eb5f-49a9-b57d-0aeed0d42eb7.jpg", "skwer", "skwer", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot2, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/f7b1009b-7762-4027-8b49-e789531e7cf4.jpg", "skwer", "skwer", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot2, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/32628ec1-ecc2-473a-b41d-14a9ff3e5d3d.jpg", "skwer", "skwer", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot2, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/9c32943b-5e06-4beb-a978-dc7c835f26db.mp4", "skwer_video", "skwer", 0, 0, GenericMediaType.VIDEO, LocalDate.of(2024, 1, 15), user, spot2, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/0206d58b-6b7a-419a-8f3e-1974463e7829.mp4", "skwer_video", "skwer", 0, 0, GenericMediaType.VIDEO, LocalDate.of(2024, 1, 15), user, spot2, new HashSet<>())
        );

        List<SpotMedia> spotMedia3 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/800413ea-ba4b-4b95-ae79-2bdaea17ce21.jpg", "park wałowy", "park wałowy", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot3, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/91739137-cbb4-4e1e-9f61-1b9589b7a1ca.jpg", "park wałowy", "park wałowy", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot3, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/41e751cd-7029-43cf-b9b4-bca30fa8ab90.jpg", "park wałowy", "park wałowy", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), user, spot3, new HashSet<>())
        );

        List<SpotMedia> spotMedia4 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/777e20d5-a5cc-4811-97e0-c70d2fbc3b7a.jpg", "park", "park", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), user, spot4, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/60ac5562-29af-477a-bf86-8cb798c7f51b.jpg", "park", "park", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), user, spot4, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/d64b7781-b188-4d0a-af33-95268b81d751.JPG", "park", "park", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), user, spot4, new HashSet<>())
        );

        List<SpotMedia> spotMedia5 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/77342dd9-daab-4e05-8aed-272907d94dc8.jpg", "jar", "jar", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), user, spot5, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/6f58c6e0-1990-4855-b9ca-6418c5879e31.jpg", "jar", "jar", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), user, spot5, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/e3b361a5-4b25-41b9-a1b2-0c4d8db70afb.JPG", "jar", "jar", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), user, spot5, new HashSet<>())
        );

        List<SpotMedia> spotMedia6 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/18ff9b26-feef-4a53-b4df-64eba49e0075.jpg", "plac kobzdeja", "plac kobzdeja", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), user, spot6, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/16a82ce9-d6b4-4740-8b5e-55b27919f486.jpg", "plac kobzdeja", "plac kobzdeja", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), user, spot6, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/0dbe602d-d362-4335-a5a6-4b79267980df.JPG", "plac kobzdeja", "plac kobzdeja", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), user, spot6, new HashSet<>())
        );

        List<SpotMedia> spotMedia7 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/c3915c65-6cc3-466f-bf0d-0b1d7644cb84.jpg", "wrona", "wrona", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), user, spot7, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/f7dd6f39-6a64-4812-8c2c-467546dcab05.jpg", "wrona", "wrona", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), user, spot7, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/023fe242-49ef-4d6e-b4ad-b43d3ece8188.jpg", "wrona", "wrona", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), user, spot7, new HashSet<>())
        );

        List<SpotMedia> spotMedia8 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/faa462f9-4582-459e-8de1-6fa8d7df34ed.jpg", "plaża", "plaża", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), user, spot8, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/c9559f6d-7a03-432b-839b-7d0875db39ff.jpg", "plaża", "plaża", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), user, spot8, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/dc0ca9b3-fecc-445f-b592-42b9ca13924c.jpg", "plaża", "plaża", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), user, spot8, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/a60e0d2a-4966-4bd5-a949-990a2babc261.jpg", "plaża", "plaża", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), user, spot8, new HashSet<>())
        );

        List<SpotMedia> spotMedia9 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/dc2a4d50-e450-4a2a-af97-9f96c4ea4e9a.jpg", "orunia", "orunia", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), user, spot9, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/65b0b74d-9172-4005-a699-eb01b52c3b5f.jpg", "orunia", "orunia", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), user, spot9, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/84cd9748-2ce4-466d-8ce4-a2adeb341e9c.jpg", "orunia", "orunia", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), user, spot9, new HashSet<>())
        );

        List<SpotMedia> spotMedia10 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/5566b23d-a037-4b44-b98e-e4a76fc7cfe0.jpg", "workout", "workout", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 10, 10), user, spot10, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/4cc317db-8d8a-4514-9688-bd60a1f74af0.jpg", "workout", "workout", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 10, 10), user, spot10, new HashSet<>())
        );

        var spots = new ArrayList<>(List.of(spot1, spot2, spot3, spot4, spot5, spot6, spot7, spot8, spot9, spot10));
        var contours = List.of(contour1, contour2, contour3, contour4, contour5, contour6, contour7, contour8, contour9, contour10);
        List<List<SpotComment>> commentLists = List.of(spotCommentList1, spotCommentList2, spotCommentList3, spotCommentList4, spotCommentList5, spotCommentList6, spotCommentList7, spotCommentList8, spotCommentList9, spotCommentList10);
        List<List<SpotMedia>> spotMediaList = List.of(spotMedia1, spotMedia2, spotMedia3, spotMedia4, spotMedia5, spotMedia6, spotMedia7, spotMedia8, spotMedia9, spotMedia10);

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

            tagList.add(tag);
        }

        spotTagRepository.saveAll(tagList);

        for (int i = 0; i < spots.size(); i++) {
            Spot spot = spots.get(i);
            spot.getBorderPoints().addAll(contours.get(i));
            spot.getSpotComments().addAll(commentLists.get(i));
            spot.getMedia().addAll(spotMediaList.get(i));
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
            var firstComment = spot.getSpotComments().getFirst();
            var mediaList = spot.getMedia().stream()
                    .map(media -> SpotCommentMedia.builder()
                            .url(media.getUrl())
                            .spotComment(firstComment)
                            .genericMediaType(media.getGenericMediaType())
                            .build())
                    .collect(Collectors.toCollection(ArrayList::new));
            firstComment.setMedia(mediaList);
            spotCommentRepository.save(firstComment);
        }

        spotRepository.saveAll(spots);
    }
}
