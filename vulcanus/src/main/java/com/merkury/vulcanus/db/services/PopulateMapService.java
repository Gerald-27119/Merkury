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

    @Transactional
    public void initMapData2() {

        var user = userEntityRepository.findByUsername("user").orElseThrow();
        Spot spot11 = Spot.builder()
                .name("Zamek Królewski na Wawelu")
                .city("Kraków")
                .region("Małopolskie")
                .country("Poland")
                .street("Wawel 5")
                .areaColor("#A8071A")
                .description("Ikoniczny zamek królewski z widokiem na Wisłę – obowiązkowy punkt w Krakowie.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour11 = asList(
                new BorderPoint(50.055442500172546, 19.93584997439629),
                new BorderPoint(50.05486768755105, 19.9334513072007),
                new BorderPoint(50.05376684793177, 19.932969884560038),
                new BorderPoint(50.05307813247066, 19.933409077144972),
                new BorderPoint(50.05253582987572, 19.93414388012411),
                new BorderPoint(50.05259548346112, 19.93531787568716),
                new BorderPoint(50.05404341592575, 19.9389412145143),
                new BorderPoint(50.0544609763478, 19.93834154771514),
                new BorderPoint(50.05522016780537, 19.937471608555995),
                new BorderPoint(50.055442500172546, 19.93584997439629)
        );

        Spot spot12 = Spot.builder()
                .name("Rynek Główny")
                .city("Kraków")
                .region("Małopolskie")
                .country("Poland")
                .street("Rynek Główny")
                .areaColor("#A8071A")
                .description("Główna płyta rynku z Sukiennicami i świetnym klimatem o każdej porze roku.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour12 = asList(
                new BorderPoint(50.06598946220913, 19.93618754024945),
                new BorderPoint(50.06248966616741, 19.93225534238283),
                new BorderPoint(50.06193215295514, 19.93198997933675),
                new BorderPoint(50.05538088734224, 19.93483660113722),
                new BorderPoint(50.05556675117765, 19.935801557668555),
                new BorderPoint(50.05538088734224, 19.937441983771805),
                new BorderPoint(50.05431215631651, 19.93910653378836),
                new BorderPoint(50.0546993804528, 19.939757879447),
                new BorderPoint(50.05885022689148, 19.940939951199283),
                new BorderPoint(50.059058262502106, 19.94111507819838),
                new BorderPoint(50.060730882898554, 19.943696336921107),
                new BorderPoint(50.06283706266737, 19.944781913018858),
                new BorderPoint(50.064485494336765, 19.94466667923527),
                new BorderPoint(50.06617341071265, 19.939817772665407),
                new BorderPoint(50.06598946220913, 19.93618754024945)
        );

        Spot spot13 = Spot.builder()
                .name("Park św. Kingi")
                .city("Wieliczka")
                .region("Małopolskie")
                .country("Poland")
                .street("Daniłowicza 10")
                .areaColor("#A8071A")
                .description("Park obok kopalni soli")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour13 = asList(
                new BorderPoint(49.98246549502909, 20.053718440182735),
                new BorderPoint(49.98194896561907, 20.05315919470769),
                new BorderPoint(49.98140627684646, 20.052183057152263),
                new BorderPoint(49.98063473287283, 20.052701630229194),
                new BorderPoint(49.98078511953344, 20.054948780226),
                new BorderPoint(49.98102050640634, 20.055935085881572),
                new BorderPoint(49.98162204540469, 20.057053576830526),
                new BorderPoint(49.98283163909994, 20.0563824822612),
                new BorderPoint(49.98247857165103, 20.054674241539175),
                new BorderPoint(49.98258318449865, 20.054165836562362),
                new BorderPoint(49.98230203695488, 20.05410482796512),
                new BorderPoint(49.98226934527338, 20.053972642670573),
                new BorderPoint(49.982419726824304, 20.053962474571648),
                new BorderPoint(49.98256356960704, 20.053962474571648),
                new BorderPoint(49.98246549502909, 20.053718440182735)
        );

        Spot spot14 = Spot.builder()
                .name("Morskie Oko")
                .city("Zakopane")
                .region("Małopolskie")
                .country("Poland")
                .street("Brak (szlak/teren)")
                .areaColor("#A8071A")
                .description("Jezioro w Tatrach z klasyczną trasą spacerową i genialnymi widokami.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour14 = asList(
                new BorderPoint(49.20116808865009, 20.070449673751227),
                new BorderPoint(49.199908798688966, 20.068390422268237),
                new BorderPoint(49.19797667504017, 20.067307995206676),
                new BorderPoint(49.197217605812426, 20.06751920048697),
                new BorderPoint(49.19661379242643, 20.0666743793642),
                new BorderPoint(49.19633776099491, 20.065829558243024),
                new BorderPoint(49.19597546740334, 20.065380747022346),
                new BorderPoint(49.19500933818534, 20.065195942402113),
                new BorderPoint(49.19466428746307, 20.065671154282796),
                new BorderPoint(49.194388245152254, 20.067228793226576),
                new BorderPoint(49.19356010897718, 20.06912964074931),
                new BorderPoint(49.193749891408515, 20.070872084311844),
                new BorderPoint(49.193594614927946, 20.071822508073154),
                new BorderPoint(49.194353739755115, 20.071664104112983),
                new BorderPoint(49.194802308040806, 20.072720130514455),
                new BorderPoint(49.19614798849216, 20.073644153615817),
                new BorderPoint(49.19716585066817, 20.073696954935855),
                new BorderPoint(49.19775240579912, 20.074145766158125),
                new BorderPoint(49.199201512182384, 20.07409296483803),
                new BorderPoint(49.20034006598459, 20.0732217430552),
                new BorderPoint(49.20111633763966, 20.07179610741315),
                new BorderPoint(49.20116808865009, 20.070449673751227)
        );

        Spot spot15 = Spot.builder()
                .name("Plaża Dębki")
                .city("Dębki")
                .region("Pomorskie")
                .country("Poland")
                .street("Brak")
                .areaColor("#A8071A")
                .description("Szeroka plaża i wydmy – dużo miejsca na spokojny lot (poza tłumem).")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour15 = asList(
                new BorderPoint(54.833491950882035, 18.06349247114349),
                new BorderPoint(54.832564024611, 18.062606370713183),
                new BorderPoint(54.83319037718357, 18.065747999512723),
                new BorderPoint(54.83207187706569, 18.109267693696665),
                new BorderPoint(54.832605443782484, 18.106528837819923),
                new BorderPoint(54.8334405775297, 18.09484842305443),
                new BorderPoint(54.833750971903385, 18.06799535975452),
                new BorderPoint(54.833491950882035, 18.06349247114349)
        );

        Spot spot16 = Spot.builder()
                .name("Plaża Jantar")
                .city("Jantar")
                .region("Pomorskie")
                .country("Poland")
                .street("Gdańska")
                .areaColor("#A8071A")
                .description("Długa, otwarta plaża – fajna do ujęć linii brzegowej i zachodów słońca.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour16 = asList(
                new BorderPoint(54.34479391297472, 19.01436139279511),
                new BorderPoint(54.34435377640861, 19.01419359974139),
                new BorderPoint(54.34412544376468, 19.026764789202304),
                new BorderPoint(54.34381675349968, 19.035034080518898),
                new BorderPoint(54.34412544376633, 19.043559522316144),
                new BorderPoint(54.34442122787837, 19.05085329540384),
                new BorderPoint(54.34489612803421, 19.051056972529835),
                new BorderPoint(54.34479391297472, 19.01436139279511)
        );

        Spot spot17 = Spot.builder()
                .name("Klif w Jastrzębiej Górze")
                .city("Jastrzębia Góra")
                .region("Pomorskie")
                .country("Poland")
                .street("Norwida")
                .areaColor("#A8071A")
                .description("Klifowe wybrzeże i morze w kadrze – efektowne ujęcia z góry")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour17 = asList(
                new BorderPoint(54.8354346826296, 18.3005756104736),
                new BorderPoint(54.83393681467902, 18.300803746198966),
                new BorderPoint(54.83411200678324, 18.30274289986542),
                new BorderPoint(54.83543030298, 18.302986244639186),
                new BorderPoint(54.8354346826296, 18.3005756104736)
        );

        Spot spot18 = Spot.builder()
                .name("Plaża Międzywodzie")
                .city("Międzywodzie")
                .region("Zachodniopomorskie")
                .country("Poland")
                .street("Morska")
                .areaColor("#A8071A")
                .description("Szeroki pas plaży – dobre miejsce na spokojne loty o wschodzie lub poza sezonem.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour18 = asList(
                new BorderPoint(54.00809356134903, 14.685536258888504),
                new BorderPoint(54.00785513306775, 14.685729457052247),
                new BorderPoint(54.01179470136927, 14.698654414212399),
                new BorderPoint(54.0119763439385, 14.698268017883692),
                new BorderPoint(54.010727535261, 14.69380514030044),
                new BorderPoint(54.00809356134903, 14.685536258888504)
        );

        Spot spot19 = Spot.builder()
                .name("Pustynia Błędowska")
                .city("Klucze")
                .region("Małopolskie")
                .country("Poland")
                .street("Bolesławska")
                .areaColor("#A8071A")
                .description("Szerokie, otwarte przestrzenie – jedne z najlepszych kadrów “pustynnych” w PL.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour19 = asList(
                new BorderPoint(50.34590203405713, 19.48777412132705),
                new BorderPoint(50.336848962065034, 19.485399530839288),
                new BorderPoint(50.33724781214184, 19.494023043661713),
                new BorderPoint(50.339840256017595, 19.495835231139438),
                new BorderPoint(50.3397206078761, 19.49877222463624),
                new BorderPoint(50.33756688979224, 19.512832299890846),
                new BorderPoint(50.33409680526472, 19.51670663173863),
                new BorderPoint(50.33361815302402, 19.52245564028661),
                new BorderPoint(50.335891708217275, 19.531454088449976),
                new BorderPoint(50.33501420857948, 19.53320378670341),
                new BorderPoint(50.33513386857541, 19.534641038840164),
                new BorderPoint(50.335891708217275, 19.534890995733548),
                new BorderPoint(50.337447235924486, 19.54295210554588),
                new BorderPoint(50.34207363267382, 19.542077256419134),
                new BorderPoint(50.34416148818573, 19.548307840641172),
                new BorderPoint(50.34647441591056, 19.548807754428793),
                new BorderPoint(50.347391580196046, 19.548057883747845),
                new BorderPoint(50.34635478448047, 19.54612071782438),
                new BorderPoint(50.346115520716154, 19.543308702773288),
                new BorderPoint(50.34495906219436, 19.541559004519826),
                new BorderPoint(50.3440817300482, 19.54087162306311),
                new BorderPoint(50.34396209259074, 19.53762218344866),
                new BorderPoint(50.345158453604256, 19.53680982354527),
                new BorderPoint(50.34440076179473, 19.534122786940856),
                new BorderPoint(50.34308474202757, 19.532685534804074),
                new BorderPoint(50.343204381695045, 19.53081085810308),
                new BorderPoint(50.344480519396484, 19.524311978874096),
                new BorderPoint(50.34437726552875, 19.51298445506316),
                new BorderPoint(50.34361956125667, 19.509610037002062),
                new BorderPoint(50.34461653805059, 19.505485748260867),
                new BorderPoint(50.34298148512528, 19.499049358255235),
                new BorderPoint(50.34182495028705, 19.49742463844848),
                new BorderPoint(50.34190471221447, 19.495050047960746),
                new BorderPoint(50.34353980220905, 19.494550134174062),
                new BorderPoint(50.34493556620461, 19.494925069514068),
                new BorderPoint(50.34590203405713, 19.48777412132705)
        );

        Spot spot20 = Spot.builder()
                .name("Park Skaryszewski")
                .city("Warszawa")
                .region("Mazowieckie")
                .country("Poland")
                .street("al. Zieleniecka")
                .areaColor("#A8071A")
                .description("Sporo przestrzeni i wody w kadrach; najlepiej wcześnie rano, gdy jest mniej ludzi.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour20 = asList(
                new BorderPoint(52.246310361657635, 21.047996088027304),
                new BorderPoint(52.23890347032753, 21.051516499815165),
                new BorderPoint(52.23859549840404, 21.052866432154246),
                new BorderPoint(52.24041088101467, 21.062315958529524),
                new BorderPoint(52.24585658330042, 21.05937787049737),
                new BorderPoint(52.24559727929832, 21.05556629683244),
                new BorderPoint(52.24566210544094, 21.052575270277174),
                new BorderPoint(52.246310361657635, 21.047996088027304)
        );

        Spot spot21 = Spot.builder()
                .name("Błonia Krakowskie")
                .city("Kraków")
                .region("Małopolskie")
                .country("Poland")
                .street("al. 3 Maja")
                .areaColor("#A8071A")
                .description("Ogromna otwarta przestrzeń – idealna do treningu i szerokich kadrów.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour21 = asList(
                new BorderPoint(50.062387874222225, 19.902541306915225),
                new BorderPoint(50.060280816899535, 19.901164905314573),
                new BorderPoint(50.05698410607235, 19.907623405134558),
                new BorderPoint(50.059176274073366, 19.923160861668123),
                new BorderPoint(50.062387874222225, 19.902541306915225)
        );

        Spot spot22 = Spot.builder()
                .name("Łąki Nowohuckie")
                .city("Kraków")
                .region("Małopolskie")
                .country("Poland")
                .street("Biskupa Filipa Padniewskiego")
                .areaColor("#A8071A")
                .description("Otwarte łąki i ścieżki – świetne na krajobrazowe ujęcia bez zabudowy w kadrze.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour22 = asList(
                new BorderPoint(50.070276824269826, 20.033955395120813),
                new BorderPoint(50.06939537272916, 20.030607998269687),
                new BorderPoint(50.06790788651793, 20.029105961221717),
                new BorderPoint(50.06694375044336, 20.029535114664014),
                new BorderPoint(50.065965821197466, 20.029191791910193),
                new BorderPoint(50.06395480544364, 20.035435974496664),
                new BorderPoint(50.064560873861666, 20.035371601480307),
                new BorderPoint(50.06392241069179, 20.0378538617625),
                new BorderPoint(50.06311684505013, 20.041264876821344),
                new BorderPoint(50.06326683821922, 20.0437003001135),
                new BorderPoint(50.06253678062336, 20.046833120242155),
                new BorderPoint(50.06341835821473, 20.047669969454603),
                new BorderPoint(50.06424482249284, 20.04447277630956),
                new BorderPoint(50.064837113132626, 20.04271324719494),
                new BorderPoint(50.0660492200156, 20.042069517031535),
                new BorderPoint(50.067233749420836, 20.04114683713061),
                new BorderPoint(50.06814278703112, 20.04015978421336),
                new BorderPoint(50.06932726473238, 20.037971101657746),
                new BorderPoint(50.06967158415745, 20.037627778903925),
                new BorderPoint(50.070276824269826, 20.033955395120813)
        );

        Spot spot23 = Spot.builder()
                .name("Pole Mokotowskie")
                .city("Warszawa")
                .region("Mazowieckie")
                .country("Poland")
                .street("Stefana Batorego")
                .areaColor("#A8071A")
                .description("Duże otwarte polany w środku miasta – dobre na spokojne, niskie przeloty i trening.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour23 = asList(
                new BorderPoint(52.207157516202074, 20.998930156473904),
                new BorderPoint(52.20870114649182, 20.99848033711544),
                new BorderPoint(52.20909492114339, 20.99878878467652),
                new BorderPoint(52.21058565248771, 21.00651657050099),
                new BorderPoint(52.21305953604269, 21.005686548518582),
                new BorderPoint(52.21263429721907, 21.002100845637784),
                new BorderPoint(52.21426435727071, 21.001586766371815),
                new BorderPoint(52.21318534257412, 20.99637665185827),
                new BorderPoint(52.212319113494345, 20.996762211307725),
                new BorderPoint(52.211129261248345, 20.99020306496743),
                new BorderPoint(52.211074135531504, 20.988609419241385),
                new BorderPoint(52.2093652043815, 20.988095339975445),
                new BorderPoint(52.20783734854004, 20.994881186315638),
                new BorderPoint(52.207157516202074, 20.998930156473904)
        );

        Spot spot24 = Spot.builder()
                .name("Park Cytadela")
                .city("Poznań")
                .region("Wielkopolskie")
                .country("Poland")
                .street("al. Armii Poznań")
                .areaColor("#A8071A")
                .description("Spory park z otwartymi fragmentami; najlepiej w godzinach, gdy jest spokojniej.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour24 = asList(
                new BorderPoint(52.42544437863822, 16.93090552191805),
                new BorderPoint(52.42327145543027, 16.928622005675237),
                new BorderPoint(52.421771769907394, 16.924029879602955),
                new BorderPoint(52.42115963870674, 16.923954598847672),
                new BorderPoint(52.42086887340946, 16.92400478601786),
                new BorderPoint(52.420440373686745, 16.925384933199126),
                new BorderPoint(52.418343725720916, 16.930729866822446),
                new BorderPoint(52.41767032858033, 16.93198454607824),
                new BorderPoint(52.41725710251575, 16.933063570236925),
                new BorderPoint(52.41684387257931, 16.93662685931912),
                new BorderPoint(52.41777746063147, 16.94056655217915),
                new BorderPoint(52.41812946410985, 16.94041599066867),
                new BorderPoint(52.41959866567876, 16.942749694081698),
                new BorderPoint(52.42024142597134, 16.942548945400972),
                new BorderPoint(52.42111372852415, 16.943502501634242),
                new BorderPoint(52.42083826642451, 16.944104747676306),
                new BorderPoint(52.421389188902765, 16.945233959006657),
                new BorderPoint(52.42178707307846, 16.944757180890036),
                new BorderPoint(52.422720556472086, 16.945936579389098),
                new BorderPoint(52.423164336727496, 16.943678156729845),
                new BorderPoint(52.423363271254004, 16.943151191443064),
                new BorderPoint(52.423761137614434, 16.942197635209766),
                new BorderPoint(52.4242661166698, 16.93988902538186),
                new BorderPoint(52.42536786907641, 16.939286779339767),
                new BorderPoint(52.42614826037203, 16.939537715190625),
                new BorderPoint(52.42613295871473, 16.939035843488966),
                new BorderPoint(52.42467927704902, 16.935623115915746),
                new BorderPoint(52.42556679366015, 16.931432487206337),
                new BorderPoint(52.42544437863822, 16.93090552191805)
        );

        Spot spot25 = Spot.builder()
                .name("Park Śląski")
                .city("Chorzów")
                .region("Śląskie")
                .country("Poland")
                .street("Różana")
                .areaColor("#A8071A")
                .description("Ogromny park – dużo przestrzeni, tylko omijaj tłoczne strefy atrakcji.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour25 = asList(
                new BorderPoint(50.290845680365464, 18.95279851890433),
                new BorderPoint(50.290553539131054, 18.952512730271792),
                new BorderPoint(50.28893942647997, 18.95240984636311),
                new BorderPoint(50.28762472413496, 18.952032605366554),
                new BorderPoint(50.287617420131596, 18.952844245085657),
                new BorderPoint(50.2873909954711, 18.95333580153553),
                new BorderPoint(50.2868358852933, 18.952969992084945),
                new BorderPoint(50.28650719858362, 18.952752792722976),
                new BorderPoint(50.28630915660759, 18.952845154295204),
                new BorderPoint(50.286243418719664, 18.95385113028425),
                new BorderPoint(50.28689348939807, 18.953828267193614),
                new BorderPoint(50.28690809762588, 18.954948558635976),
                new BorderPoint(50.287675023290376, 18.955051442543265),
                new BorderPoint(50.28771884724074, 18.956994805250815),
                new BorderPoint(50.288463848222165, 18.957326320064652),
                new BorderPoint(50.28852227917844, 18.95896103104755),
                new BorderPoint(50.28944255727609, 18.95885814714029),
                new BorderPoint(50.289230748814475, 18.956823332070115),
                new BorderPoint(50.289208837540514, 18.955531567448503),
                new BorderPoint(50.28934760877195, 18.95550870435784),
                new BorderPoint(50.28940444980722, 18.95502424751544),
                new BorderPoint(50.28970390178111, 18.955012815970804),
                new BorderPoint(50.289740420185524, 18.95386966143778),
                new BorderPoint(50.290845680365464, 18.95279851890433)
        );

        Spot spot26 = Spot.builder()
                .name("Jasne Błonia")
                .city("Szczecin")
                .region("Zachodniopomorskie")
                .country("Poland")
                .street("Jana Pawła II")
                .areaColor("#A8071A")
                .description("Szerokie aleje i otwarte fragmenty; najlepiej wcześnie rano.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour26 = asList(
                new BorderPoint(53.4418558179174, 14.539704984689536),
                new BorderPoint(53.44193843921104, 14.53992075682882),
                new BorderPoint(53.43882625953091, 14.54304945284889),
                new BorderPoint(53.43809178860306, 14.54086090686414),
                new BorderPoint(53.441240743236705, 14.537809272322335),
                new BorderPoint(53.4418558179174, 14.539704984689536)
        );

        Spot spot27 = Spot.builder()
                .name("Park Grabiszyński")
                .city("Wrocław")
                .region("Dolnośląskie")
                .country("Poland")
                .street("Grabiszyńska")
                .areaColor("#A8071A")
                .description("Duży park z polanami – dobre miejsce na “parkowe” ujęcia bez ścisłego centrum.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour27 = asList(
                new BorderPoint(51.09812295791386, 17.000956193793797),
                new BorderPoint(51.097651875043226, 17.00103954288386),
                new BorderPoint(51.09766496074329, 17.001685498332165),
                new BorderPoint(51.09470749835765, 17.002485953525564),
                new BorderPoint(51.09396155983168, 17.00074604126911),
                new BorderPoint(51.09443479847417, 16.99775236967872),
                new BorderPoint(51.09399639487958, 16.997616927407933),
                new BorderPoint(51.09416652214114, 16.997325205592574),
                new BorderPoint(51.096600862752695, 16.998450269356965),
                new BorderPoint(51.09755613084158, 16.998293989813646),
                new BorderPoint(51.09812295791386, 17.000956193793797)
        );

        Spot spot28 = Spot.builder()
                .name("Park Tysiąclecia")
                .city("Wrocław")
                .region("Dolnośląskie")
                .country("Poland")
                .street("Kozanowska")
                .areaColor("#A8071A")
                .description("Sporo przestrzeni; koniecznie sprawdź strefy, bo to okolice lotnicze.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour28 = asList(
                new BorderPoint(51.1407204323568, 16.97683257021555),
                new BorderPoint(51.14000302871537, 16.973751476212072),
                new BorderPoint(51.139929998977266, 16.97380625121656),
                new BorderPoint(51.13984408149008, 16.97362138557679),
                new BorderPoint(51.139040745248025, 16.974196523123993),
                new BorderPoint(51.13891186647493, 16.97416228874573),
                new BorderPoint(51.13876580343046, 16.978297801586535),
                new BorderPoint(51.13931138950076, 16.979235823538033),
                new BorderPoint(51.14023500476554, 16.978023926564077),
                new BorderPoint(51.14071184076238, 16.977017435856112),
                new BorderPoint(51.1407204323568, 16.97683257021555)
        );

        Spot spot29 = Spot.builder()
                .name("Bulwary nad Wisłokiem")
                .city("Rzeszów")
                .region("Podkarpackie")
                .country("Poland")
                .street("Bulwary")
                .areaColor("#A8071A")
                .description("Rzeka i zieleń w kadrze – dobre do dłuższych, płynnych przelotów.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour29 = asList(
                new BorderPoint(50.0196281344503, 21.998518917772742),
                new BorderPoint(50.019677608723214, 21.998255835172785),
                new BorderPoint(50.018906628854694, 21.99725483796786),
                new BorderPoint(50.01881592452736, 21.99611909113949),
                new BorderPoint(50.01898084135874, 21.996151174382817),
                new BorderPoint(50.0190962828039, 21.995310593396198),
                new BorderPoint(50.01896434970109, 21.995336259991234),
                new BorderPoint(50.01894785803779, 21.994912761174476),
                new BorderPoint(50.018712851220045, 21.994887094579468),
                new BorderPoint(50.01811089869011, 21.99609984119286),
                new BorderPoint(50.01778081361107, 21.99628747920761),
                new BorderPoint(50.01758703143625, 21.99628747920761),
                new BorderPoint(50.017405617627844, 21.99650564526584),
                new BorderPoint(50.01733552574544, 21.99681364440582),
                new BorderPoint(50.01852552311328, 21.997800226773535),
                new BorderPoint(50.0196281344503, 21.998518917772742)
        );

        Spot spot30 = Spot.builder()
                .name("Park na Zdrowiu")
                .city("Łódź")
                .region("Łódzkie")
                .country("Poland")
                .street("Konstantynowska")
                .areaColor("#A8071A")
                .description("Duży kompleks zieleni – dużo miejsca na ujęcia parkowe i trening lotu.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour30 = asList(
                new BorderPoint(51.772636924598515, 19.41753441864128),
                new BorderPoint(51.767387214464065, 19.421114875797173),
                new BorderPoint(51.763015316916665, 19.4085671475666),
                new BorderPoint(51.76547081834394, 19.406051150645965),
                new BorderPoint(51.772636924598515, 19.407244636365192),
                new BorderPoint(51.774074001143134, 19.40892196764503),
                new BorderPoint(51.772636924598515, 19.41753441864128)
        );

        Spot spot31 = Spot.builder()
                .name("Jezioro Tarnobrzeskie")
                .city("Tarnobrzeg")
                .region("Podkarpackie")
                .country("Poland")
                .street("wisłostrada")
                .areaColor("#A8071A")
                .description("Rozległy akwen – idealny na trening i przeloty nad wodą.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour31 = asList(
                new BorderPoint(50.55381860383744, 21.65468789643907),
                new BorderPoint(50.552787245803046, 21.639193090687883),
                new BorderPoint(50.543785345181846, 21.627092385243344),
                new BorderPoint(50.537595541529896, 21.624436132829373),
                new BorderPoint(50.53730638402058, 21.62452177302407),
                new BorderPoint(50.537337817968364, 21.62525539203355),
                new BorderPoint(50.53878375694754, 21.62645061401213),
                new BorderPoint(50.53957227009809, 21.62851331275931),
                new BorderPoint(50.53924222823113, 21.628645199322364),
                new BorderPoint(50.53737718634733, 21.62824129672336),
                new BorderPoint(50.53677600162834, 21.628724789718405),
                new BorderPoint(50.536472135631016, 21.628263186747546),
                new BorderPoint(50.536016332965005, 21.626012872264084),
                new BorderPoint(50.53556440736304, 21.623762398091827),
                new BorderPoint(50.53563775591863, 21.622872163790873),
                new BorderPoint(50.53543342751672, 21.622880438343003),
                new BorderPoint(50.53535483943415, 21.623778915554624),
                new BorderPoint(50.53479947991602, 21.623828373015783),
                new BorderPoint(50.53436006875859, 21.625460035196653),
                new BorderPoint(50.53376278245452, 21.625674350861686),
                new BorderPoint(50.53257041274429, 21.63788991932344),
                new BorderPoint(50.531457922613015, 21.63995569350334),
                new BorderPoint(50.53007047505818, 21.648342097988063),
                new BorderPoint(50.531602466924255, 21.651584215799062),
                new BorderPoint(50.534502172471434, 21.652760559429225),
                new BorderPoint(50.53815926095896, 21.656069585262173),
                new BorderPoint(50.53846925778765, 21.657762372438214),
                new BorderPoint(50.53852396289889, 21.659627307461733),
                new BorderPoint(50.53812279060992, 21.659225629148978),
                new BorderPoint(50.53784926209289, 21.65913955522481),
                new BorderPoint(50.53688278196165, 21.662008686031072),
                new BorderPoint(50.536591010483505, 21.664849125529287),
                new BorderPoint(50.53763043813669, 21.666054160467525),
                new BorderPoint(50.539162184508285, 21.66591070392471),
                new BorderPoint(50.55103205413599, 21.657848985781072),
                new BorderPoint(50.552949554378216, 21.65713044054317),
                new BorderPoint(50.55381860383744, 21.65468789643907)
        );

        Spot spot32 = Spot.builder()
                .name("Jezioro Żarnowieckie")
                .city("Żarnowiec")
                .region("Pomorskie")
                .country("Poland")
                .street("Długa")
                .areaColor("#A8071A")
                .description("Duży akwen i otwarte brzegi – dobre na panoramy i loty nad wodą.")
                .rating(5.0)
                .ratingCount(0)
                .author(user)
                .timeZone("Europe/Warsaw")
                .build();

        var contour32 = asList(
                new BorderPoint(54.796198978334616, 18.051466495265117),
                new BorderPoint(54.79451559478571, 18.040235673680343),
                new BorderPoint(54.79024207555656, 18.03791463721879),
                new BorderPoint(54.78419794391897, 18.039037719377063),
                new BorderPoint(54.78052785179213, 18.034545390744086),
                new BorderPoint(54.77859545750022, 18.024647063386453),
                new BorderPoint(54.77505441324891, 18.02367372551595),
                new BorderPoint(54.77060607698286, 18.02824092629399),
                new BorderPoint(54.76719841446288, 18.032460595349733),
                new BorderPoint(54.75708981645903, 18.041744741192446),
                new BorderPoint(54.74731180532788, 18.050469431566057),
                new BorderPoint(54.743206175418834, 18.05645920307788),
                new BorderPoint(54.73759625529422, 18.059690569052094),
                new BorderPoint(54.734916195972744, 18.06530597984562),
                new BorderPoint(54.73141456102883, 18.07069677420634),
                new BorderPoint(54.72899831800214, 18.077842787579897),
                new BorderPoint(54.72860920557159, 18.08173613906297),
                new BorderPoint(54.72640416455721, 18.083083837652822),
                new BorderPoint(54.72411252421844, 18.083832559092798),
                new BorderPoint(54.722945034982246, 18.08278434907575),
                new BorderPoint(54.72208020645917, 18.083832559091263),
                new BorderPoint(54.72290179399434, 18.08547974625668),
                new BorderPoint(54.72463139753003, 18.086453084127157),
                new BorderPoint(54.72943066076559, 18.085105385537275),
                new BorderPoint(54.73077089401863, 18.086453084127157),
                new BorderPoint(54.73215431410824, 18.089672586315316),
                new BorderPoint(54.735137152957265, 18.092592599926775),
                new BorderPoint(54.7416771520158, 18.083550973710004),
                new BorderPoint(54.75265139686138, 18.08092618026754),
                new BorderPoint(54.75986816307196, 18.078070536930795),
                new BorderPoint(54.7664774630349, 18.07110742754739),
                new BorderPoint(54.77049435326123, 18.06983460110135),
                new BorderPoint(54.77407886501953, 18.064723781258692),
                new BorderPoint(54.77891545245123, 18.065023269834228),
                new BorderPoint(54.784528623463444, 18.062552489086073),
                new BorderPoint(54.791394484200595, 18.059510171456452),
                new BorderPoint(54.79424346600541, 18.057338879283776),
                new BorderPoint(54.79618583849202, 18.05284655064966),
                new BorderPoint(54.796198978334616, 18.051466495265117)
        );

        // ===================== ZAPIS =====================

        var spots = new ArrayList<>(List.of(
                spot11, spot12, spot13, spot14, spot15, spot16, spot17, spot18, spot19, spot20,
                spot21, spot22, spot23, spot24, spot25, spot26, spot27, spot28, spot29, spot30,
                spot31, spot32
        ));

        var contours = List.of(
                contour11, contour12, contour13, contour14, contour15, contour16, contour17, contour18, contour19, contour20,
                contour21, contour22, contour23, contour24, contour25, contour26, contour27, contour28, contour29, contour30,
                contour31, contour32
        );

        for (int i = 11; i < spots.size(); i++) {
            Spot spot = spots.get(i);
            spot.getBorderPoints().addAll(contours.get(i));

            spot.setArea(PolygonAreaCalculator.calculateArea(spot.getBorderPoints().toArray(new BorderPoint[0])));
            spot.setCenterPoint(PolygonCenterPointCalculator.calculateCenterPoint(spot.getBorderPoints()));
        }

        spotRepository.saveAll(spots);
    }
}
