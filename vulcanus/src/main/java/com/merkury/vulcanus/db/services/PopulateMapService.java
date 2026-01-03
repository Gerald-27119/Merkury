package com.merkury.vulcanus.db.services;

import com.merkury.vulcanus.model.embeddable.BorderPoint;
import com.merkury.vulcanus.model.entities.UserEntity;
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
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Supplier;
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

        var authors = new ArrayList<>(userEntityRepository.findAll());

        var rnd = new Random(20251215);
        Supplier<UserEntity> pickAuthor = () -> authors.get(rnd.nextInt(authors.size()));

        var textIdx = new AtomicInteger(0);


        Spot spot1 = Spot.builder()
                .name("Pomnik konny Jana III Sobieskiego")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Polska")
                .street("Targ Drzewny 9")
                .areaColor("#A8071A")
                .description("Brązowy posąg XVII-wiecznego polskiego króla Jana III Sobieskiego na koniu usytuowany na małym placu.")
                .rating(5.0)
                .ratingCount(25)
                .author(pickAuthor.get())
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot2 = Spot.builder()
                .name("Skwer Czesława Niemena")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Polska")
                .street("Hucisko")
                .areaColor("#A8071A")
                .description("Mały park z ławkami i pomnikiem Czesława Niemena.")
                .rating(5.0)
                .ratingCount(25)
                .author(pickAuthor.get())
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot3 = Spot.builder()
                .name("Park Wałowy")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Polska")
                .street("Pod Zrębem 1")
                .areaColor("#A8071A")
                .description("Mały park z ławkami")
                .rating(3.5)
                .ratingCount(20)
                .author(pickAuthor.get())
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot4 = Spot.builder()
                .name("Park księdza infułata Bogdanowicza")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Polska")
                .street("Szeroka 8/10")
                .areaColor("#A8071A")
                .description("Mały park")
                .rating(3.6)
                .ratingCount(15)
                .author(pickAuthor.get())
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot5 = Spot.builder()
                .name("Jar Wilanowski")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Polska")
                .street("Antoniego Madalińskiego")
                .areaColor("#A8071A")
                .description("Zielona strefa z jeziorem")
                .rating(4.6)
                .ratingCount(8)
                .author(pickAuthor.get())
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot6 = Spot.builder()
                .name("Plac imienia Dariusza Kobzdeja")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Polska")
                .street("Podwale Staromiejskie 109/112b")
                .areaColor("#A8071A")
                .description("Mały, zadbany plac z ławeczkami i zielenią. Znajduje się on z jednej strony w pobliżu pomnika Jana III Sobieskiego, a z drugiej strony w pobliżu Hali Targowej.")
                .rating(4.5)
                .ratingCount(1)
                .author(pickAuthor.get())
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot7 = Spot.builder()
                .name("Plac Zabaw na Wroniej Górce")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Polska")
                .street("Marszałka Ferdynanda Focha")
                .areaColor("#A8071A")
                .description("Plac zabaw")
                .rating(4.8)
                .ratingCount(99)
                .author(pickAuthor.get())
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot8 = Spot.builder()
                .name("Plaża stogi")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Polska")
                .street("Wydmy 1")
                .areaColor("#A8071A")
                .description("Szeroka piaszczysta plaża.")
                .rating(4.6)
                .ratingCount(25)
                .author(pickAuthor.get())
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot9 = Spot.builder()
                .name("Park Oruński im. Emilii Hoene")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Polska")
                .street("Raduńska 44A")
                .areaColor("#A8071A")
                .description("Park Oruński należy, obok Parku Oliwskiego, należy do najcenniejszych zachowanych dawnych gdańskich parków.")
                .rating(5.0)
                .ratingCount(25)
                .author(pickAuthor.get())
                .timeZone("Europe/Warsaw")
                .build();

        Spot spot10 = Spot.builder()
                .name("Park Street Workout")
                .city("Gdańsk")
                .region("Pomorskie")
                .country("Polska")
                .street("Związkowa")
                .areaColor("#A8071A")
                .description("Park, który oryginalnie był cmentarzem protestanckim, należącym dawniej do kościoła przy placu Oruńskim.")
                .rating(4.4)
                .ratingCount(25)
                .author(pickAuthor.get())
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

        List<SpotMedia> spotMedia1 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/154b0e7b-1a59-4340-81f2-f3a0abdd3788.jpg", "pomnik", "pomnik", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), pickAuthor.get(), spot1, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/5e4f6d1d-4a36-44b1-81f3-b1e8d6037585.jpg", "pomnik", "pomnik", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), pickAuthor.get(), spot1, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/34b3c5eb-789c-473c-9ef2-582dfabf9a0e.mp4", "pomnik", "pomnik", 0, 0, GenericMediaType.VIDEO, LocalDate.of(2024, 1, 15), pickAuthor.get(), spot1, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/209214c0-288f-44f7-948e-33b8733b1e44.mp4", "pomnik", "pomnik", 0, 0, GenericMediaType.VIDEO, LocalDate.of(2024, 1, 15), pickAuthor.get(), spot1, new HashSet<>())
        );

        List<SpotMedia> spotMedia2 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/1365f3eb-48e1-405e-9e8f-2ea8c8270469.jpg", "skwer", "skwer", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), pickAuthor.get(), spot2, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/1ac638bc-e302-4129-ab22-e2b6c88cbfd8.jpg", "skwer", "skwer", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), pickAuthor.get(), spot2, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/d1203393-c51f-486b-bea0-4732a4e79553.jpg", "skwer", "skwer", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), pickAuthor.get(), spot2, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/db131fd5-10e9-4403-b18e-7016279fab5f.jpg", "skwer", "skwer", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), pickAuthor.get(), spot2, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/78743a2e-0024-4dad-868a-44c287025b07.jpg", "skwer", "skwer", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), pickAuthor.get(), spot2, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/bd16ee33-4e0e-4c55-b461-bcdfe207d90a.jpg", "skwer", "skwer", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), pickAuthor.get(), spot2, new HashSet<>())
        );

        List<SpotMedia> spotMedia3 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/6e8aa1f5-aa2f-4ec8-90cf-6329686f8e59.jpg", "park wałowy", "park wałowy", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), pickAuthor.get(), spot3, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/ec4bccf8-2c60-4634-b24a-c4825e7de127.jpg", "park wałowy", "park wałowy", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), pickAuthor.get(), spot3, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/9a45da5f-6de1-4cef-bd1a-87ceb55a163c.jpg", "park wałowy", "park wałowy", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 1, 15), pickAuthor.get(), spot3, new HashSet<>())
        );

        List<SpotMedia> spotMedia4 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/fd4848ad-ced1-4989-bcef-dec175311b68.jpg", "park", "park", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), pickAuthor.get(), spot4, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/fa06a299-9d62-44fe-8ef8-c8d4425b9a12.jpg", "park", "park", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), pickAuthor.get(), spot4, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/8e0e22f6-7694-453a-9c90-0961985ad8da.jpg", "park", "park", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), pickAuthor.get(), spot4, new HashSet<>())
        );

        List<SpotMedia> spotMedia5 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/096151e9-53ba-49e1-8f12-0925f7c6edfe.jpg", "jar", "jar", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), pickAuthor.get(), spot5, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/bd48bf1d-622f-4d2f-9284-abeb4dd8ca49.jpg", "jar", "jar", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), pickAuthor.get(), spot5, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/586c70c2-ac65-4bc5-b876-5417be54530d.jpg", "jar", "jar", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), pickAuthor.get(), spot5, new HashSet<>())
        );

        List<SpotMedia> spotMedia6 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/b2dbc148-1aec-4fcf-8d64-00432b43e981.jpg", "plac kobzdeja", "plac kobzdeja", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), pickAuthor.get(), spot6, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/40bfea54-10e8-47e0-ad48-8d1cd7bbe34e.jpg", "plac kobzdeja", "plac kobzdeja", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 4, 1), pickAuthor.get(), spot6, new HashSet<>())
        );

        List<SpotMedia> spotMedia7 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/301967ec-95b6-4586-ac7e-de54e2bd4490.jpg", "wrona", "wrona", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), pickAuthor.get(), spot7, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/e4e505eb-d778-489d-aa13-885c2efe2b9e.jpg", "wrona", "wrona", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), pickAuthor.get(), spot7, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/58219a19-1d67-4960-8a3a-8182e69b4729.jpg", "wrona", "wrona", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), pickAuthor.get(), spot7, new HashSet<>())
        );

        List<SpotMedia> spotMedia8 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/61c23c5f-9d91-484c-b600-69ea024da84f.jpg", "plaża", "plaża", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), pickAuthor.get(), spot8, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/92a34b9f-0346-403e-b3ca-42104b9a9775.jpg", "plaża", "plaża", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), pickAuthor.get(), spot8, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/0b0c9844-07b1-4663-8ae2-d30e4720ecfb.jpg", "plaża", "plaża", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), pickAuthor.get(), spot8, new HashSet<>())
        );

        List<SpotMedia> spotMedia9 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/f4510125-0951-4e54-8b72-9561a45c3502.jpg", "orunia", "orunia", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), pickAuthor.get(), spot9, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/979b8d3c-d5d3-4003-bbcf-e4e901657c8e.jpg", "orunia", "orunia", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 7, 5), pickAuthor.get(), spot9, new HashSet<>())
        );

        List<SpotMedia> spotMedia10 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/9f1e91ee-e0fe-4c1d-ba0d-b3cfa5fa666b.jpg", "workout", "workout", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 10, 10), pickAuthor.get(), spot10, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/265269d9-b574-4757-9b0c-95b3921dbbd7.jpg", "workout", "workout", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2024, 10, 10), pickAuthor.get(), spot10, new HashSet<>())
        );

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

        // === TAGI (poprawione) ===
        var tagByName = tagList.stream()
                .collect(Collectors.toMap(SpotTag::getName, t -> t));

        spot1.getTags().addAll(Set.of(tagByName.get("city"), tagByName.get("monument"), tagByName.get("old town"), tagByName.get("photography")));
        spot2.getTags().addAll(Set.of(tagByName.get("city"), tagByName.get("park"), tagByName.get("old town"), tagByName.get("photography")));
        spot3.getTags().addAll(Set.of(tagByName.get("city"), tagByName.get("park"), tagByName.get("photography")));
        spot4.getTags().addAll(Set.of(tagByName.get("city"), tagByName.get("park"), tagByName.get("old town"), tagByName.get("photography")));
        spot5.getTags().addAll(Set.of(tagByName.get("city"), tagByName.get("park"), tagByName.get("lake"), tagByName.get("photography")));
        spot6.getTags().addAll(Set.of(tagByName.get("city"), tagByName.get("park"), tagByName.get("old town"), tagByName.get("photography")));
        spot7.getTags().addAll(Set.of(tagByName.get("city"), tagByName.get("park"), tagByName.get("photography")));
        spot8.getTags().addAll(Set.of(tagByName.get("city"), tagByName.get("beach"), tagByName.get("fpv"), tagByName.get("photography")));
        spot9.getTags().addAll(Set.of(tagByName.get("city"), tagByName.get("park"), tagByName.get("lake"), tagByName.get("river"), tagByName.get("photography")));
        spot10.getTags().addAll(Set.of(tagByName.get("city"), tagByName.get("park"), tagByName.get("photography")));


        // ===================== TAGI (initMapData2) =====================

        List<String> requiredTagNames = List.of(
                "city", "countryside", "mountains", "forest", "park", "ruins",
                "lake", "river", "monument", "beach", "old town", "fpv",
                "photography", "grassland"
        );

        Map<String, SpotTag> tagsByName = spotTagRepository.findAll().stream()
                .collect(Collectors.toMap(SpotTag::getName, t -> t, (a, b) -> a));

        Map<String, SpotTag> finalTagsByName = tagsByName;
        List<SpotTag> missingTags = requiredTagNames.stream()
                .filter(n -> !finalTagsByName.containsKey(n))
                .map(n -> SpotTag.builder().name(n).spots(new HashSet<>()).build())
                .toList();

        if (!missingTags.isEmpty()) {
            spotTagRepository.saveAll(missingTags);
            tagsByName = spotTagRepository.findAll().stream()
                    .collect(Collectors.toMap(SpotTag::getName, t -> t, (a, b) -> a));
        }

        var city = tagsByName.get("city");
        var countryside = tagsByName.get("countryside");
        var mountains = tagsByName.get("mountains");
        var forest = tagsByName.get("forest");
        var park = tagsByName.get("park");
        var ruins = tagsByName.get("ruins");
        var lake = tagsByName.get("lake");
        var river = tagsByName.get("river");
        var monument = tagsByName.get("monument");
        var beach = tagsByName.get("beach");
        var oldTown = tagsByName.get("old town");
        var fpv = tagsByName.get("fpv");
        var photography = tagsByName.get("photography");
        var grassland = tagsByName.get("grassland");

        Spot spot11 = Spot.builder()
                .name("Zamek Królewski na Wawelu")
                .city("Kraków")
                .region("Małopolskie")
                .country("Polska")
                .street("Wawel 5")
                .areaColor("#A8071A")
                .description("Ikoniczny zamek królewski z widokiem na Wisłę – obowiązkowy punkt w Krakowie.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Rynek Główny")
                .areaColor("#A8071A")
                .description("Główna płyta rynku z Sukiennicami i świetnym klimatem o każdej porze roku.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Daniłowicza 10")
                .areaColor("#A8071A")
                .description("Park obok kopalni soli")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Szlak pieszy")
                .areaColor("#A8071A")
                .description("Jezioro w Tatrach z klasyczną trasą spacerową i genialnymi widokami.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Plażowa")
                .areaColor("#A8071A")
                .description("Szeroka plaża i wydmy – dużo miejsca na spokojny lot (poza tłumem).")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Gdańska")
                .areaColor("#A8071A")
                .description("Długa, otwarta plaża – fajna do ujęć linii brzegowej i zachodów słońca.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Norwida")
                .areaColor("#A8071A")
                .description("Klifowe wybrzeże i morze w kadrze – efektowne ujęcia z góry")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Morska")
                .areaColor("#A8071A")
                .description("Szeroki pas plaży – dobre miejsce na spokojne loty o wschodzie lub poza sezonem.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Bolesławska")
                .areaColor("#A8071A")
                .description("Szerokie, otwarte przestrzenie – jedne z najlepszych kadrów “pustynnych” w PL.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Zieleniecka")
                .areaColor("#A8071A")
                .description("Sporo przestrzeni i wody w kadrach; najlepiej wcześnie rano, gdy jest mniej ludzi.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("3 Maja")
                .areaColor("#A8071A")
                .description("Ogromna otwarta przestrzeń – idealna do treningu i szerokich kadrów.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Biskupa Filipa Padniewskiego")
                .areaColor("#A8071A")
                .description("Otwarte łąki i ścieżki – świetne na krajobrazowe ujęcia bez zabudowy w kadrze.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Stefana Batorego")
                .areaColor("#A8071A")
                .description("Duże otwarte polany w środku miasta – dobre na spokojne, niskie przeloty i trening.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Armii Poznań")
                .areaColor("#A8071A")
                .description("Spory park z otwartymi fragmentami; najlepiej w godzinach, gdy jest spokojniej.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Różana")
                .areaColor("#A8071A")
                .description("Ogromny park – dużo przestrzeni, tylko omijaj tłoczne strefy atrakcji.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Jana Pawła II")
                .areaColor("#A8071A")
                .description("Szerokie aleje i otwarte fragmenty; najlepiej wcześnie rano.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Grabiszyńska")
                .areaColor("#A8071A")
                .description("Duży park z polanami – dobre miejsce na “parkowe” ujęcia bez ścisłego centrum.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Kozanowska")
                .areaColor("#A8071A")
                .description("Sporo przestrzeni; koniecznie sprawdź strefy, bo to okolice lotnicze.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Bulwary")
                .areaColor("#A8071A")
                .description("Rzeka i zieleń w kadrze – dobre do dłuższych, płynnych przelotów.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Konstantynowska")
                .areaColor("#A8071A")
                .description("Duży kompleks zieleni – dużo miejsca na ujęcia parkowe i trening lotu.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Wisłostrada")
                .areaColor("#A8071A")
                .description("Rozległy akwen – idealny na trening i przeloty nad wodą.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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
                .country("Polska")
                .street("Długa")
                .areaColor("#A8071A")
                .description("Duży akwen i otwarte brzegi – dobre na panoramy i loty nad wodą.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
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

        // ===================== SPOTY 33-38 (z CSV) =====================

        Spot spot33 = Spot.builder()
                .name("Półwysep Helski")
                .city("Hel")
                .region("Pomorskie")
                .country("Polska")
                .street("Sikorskiego")
                .areaColor("#A8071A")
                .description("Szerokie plaże i klimat nadmorskich miejscowości.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
                .timeZone("Europe/Warsaw")
                .build();

        var contour33 = asList(
                new BorderPoint(54.60872927199193, 18.796297468365424),
                new BorderPoint(54.608770679542545, 18.795820826472408),
                new BorderPoint(54.60794252052659, 18.79741757681404),
                new BorderPoint(54.607335193206325, 18.79863301364267),
                new BorderPoint(54.60667264397685, 18.799586297428704),
                new BorderPoint(54.60602388740779, 18.800444252836172),
                new BorderPoint(54.605333709494914, 18.800754070066603),
                new BorderPoint(54.60467112768973, 18.801206879864992),
                new BorderPoint(54.60483677415189, 18.801492865000796),
                new BorderPoint(54.605885852761304, 18.800825566350596),
                new BorderPoint(54.606341365318485, 18.800468084930827),
                new BorderPoint(54.60721096604726, 18.799419472766175),
                new BorderPoint(54.60872927199193, 18.796297468365424)
        );

        Spot spot34 = Spot.builder()
                .name("Myślęcinek")
                .city("Bydgoszcz")
                .region("Kujawsko-Pomorskie")
                .country("Polska")
                .street("Gdańska")
                .areaColor("#A8071A")
                .description("Duży teren zieleni z polanami i lasem – dobre miejsce na spokojne ujęcia.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
                .timeZone("Europe/Warsaw")
                .build();

        var contour34 = asList(
                new BorderPoint(53.15996467819306, 18.038218791483274),
                new BorderPoint(53.160236174374575, 18.03333321207836),
                new BorderPoint(53.160893473807846, 18.031283651938367),
                new BorderPoint(53.16145074153005, 18.029829894164635),
                new BorderPoint(53.16219375390577, 18.02904343504113),
                new BorderPoint(53.163343433679614, 18.028018654972527),
                new BorderPoint(53.16432930768207, 18.027351356320878),
                new BorderPoint(53.164986544436346, 18.026660225575995),
                new BorderPoint(53.16535802162778, 18.025373292464792),
                new BorderPoint(53.165815219910854, 18.02523029989692),
                new BorderPoint(53.167172498620886, 18.0259214306418),
                new BorderPoint(53.16768682460045, 18.026255079966944),
                new BorderPoint(53.16744394921159, 18.027399020510188),
                new BorderPoint(53.16738680186151, 18.02911493132646),
                new BorderPoint(53.16715821170013, 18.030711681668123),
                new BorderPoint(53.1670724900757, 18.03209394315789),
                new BorderPoint(53.166901046313114, 18.033595365122324),
                new BorderPoint(53.16674388892906, 18.03528744384252),
                new BorderPoint(53.16701534223094, 18.036812697900217),
                new BorderPoint(53.16712963784434, 18.038266455673977),
                new BorderPoint(53.16672193840881, 18.040271820732613),
                new BorderPoint(53.166593354600735, 18.04129660080261),
                new BorderPoint(53.166293324216554, 18.043274664658668),
                new BorderPoint(53.16612187734117, 18.044347108917947),
                new BorderPoint(53.15996467819306, 18.038218791483274)
        );

        Spot spot35 = Spot.builder()
                .name("Park Konstytucji 3 Maja")
                .city("Białystok")
                .region("Podlaskie")
                .country("Polska")
                .street("Zwierzyniecka")
                .areaColor("#A8071A")
                .description("Duży park z polanami i lasem – łatwo znaleźć miejsce z dala od ludzi.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
                .timeZone("Europe/Warsaw")
                .build();

        var contour35 = asList(
                new BorderPoint(53.12352146872837, 23.164667495369372),
                new BorderPoint(53.123492927775516, 23.163827251820067),
                new BorderPoint(53.1231314073988, 23.163272374004492),
                new BorderPoint(53.11941137638428, 23.160196765540064),
                new BorderPoint(53.11867874921401, 23.164762617280644),
                new BorderPoint(53.11867874921401, 23.1662687142086),
                new BorderPoint(53.11883098445955, 23.168434220925946),
                new BorderPoint(53.11915448256488, 23.169322025430915),
                new BorderPoint(53.11917351178934, 23.169797634987134),
                new BorderPoint(53.11970632665617, 23.168672025704097),
                new BorderPoint(53.120667279629515, 23.16940129369027),
                new BorderPoint(53.12146647168089, 23.168259830755375),
                new BorderPoint(53.12111444844163, 23.16737202625046),
                new BorderPoint(53.12190411817457, 23.166436660788975),
                new BorderPoint(53.12178994995364, 23.16591349027715),
                new BorderPoint(53.12229419064215, 23.165358612461574),
                new BorderPoint(53.122160995563604, 23.164914710209132),
                new BorderPoint(53.12238932973128, 23.16453422256413),
                new BorderPoint(53.122646204220075, 23.165057393075983),
                new BorderPoint(53.122998214915185, 23.164851295601636),
                new BorderPoint(53.123121893664205, 23.164914710209132),
                new BorderPoint(53.12352146872837, 23.164667495369372)
        );

        Spot spot36 = Spot.builder()
                .name("Park Antoniuk")
                .city("Białystok")
                .region("Podlaskie")
                .country("Polska")
                .street("Antoniukowska")
                .areaColor("#A8071A")
                .description("Sporo zieleni i przestrzeni – dobre na trening i krótkie przeloty.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
                .timeZone("Europe/Warsaw")
                .build();

        var contour36 = asList(
                new BorderPoint(53.13836039569699, 23.117486415407825),
                new BorderPoint(53.13858262213549, 23.116102475189507),
                new BorderPoint(53.13844949041956, 23.115985345652433),
                new BorderPoint(53.139223473784995, 23.111294735132134),
                new BorderPoint(53.1395710883568, 23.11173859442914),
                new BorderPoint(53.139474939926885, 23.11397022033981),
                new BorderPoint(53.140261654091944, 23.118191853139933),
                new BorderPoint(53.14088290569282, 23.12141198290726),
                new BorderPoint(53.141153091418545, 23.12294890218874),
                new BorderPoint(53.141367567703526, 23.125057233848764),
                new BorderPoint(53.14143043123897, 23.125464104871753),
                new BorderPoint(53.14186727943252, 23.12596237161992),
                new BorderPoint(53.14323319758347, 23.127366684098035),
                new BorderPoint(53.14355226397018, 23.128002023664862),
                new BorderPoint(53.14291020162079, 23.12889748035363),
                new BorderPoint(53.14250890777842, 23.129504744086063),
                new BorderPoint(53.14192856851304, 23.12819758317113),
                new BorderPoint(53.14142230870823, 23.12664339972116),
                new BorderPoint(53.141013784166574, 23.125218092073936),
                new BorderPoint(53.14060629855322, 23.123663908623968),
                new BorderPoint(53.1403963802135, 23.12260377024404),
                new BorderPoint(53.13983453490417, 23.121605387499045),
                new BorderPoint(53.139680180510084, 23.12139953538653),
                new BorderPoint(53.13987166813254, 23.12061541120238),
                new BorderPoint(53.139538262235476, 23.12029634042733),
                new BorderPoint(53.13952591381923, 23.120039025287355),
                new BorderPoint(53.139254247763574, 23.120039025287355),
                new BorderPoint(53.13921720225923, 23.11793933373869),
                new BorderPoint(53.13836039569699, 23.117486415407825)
        );

        Spot spot37 = Spot.builder()
                .name("Bulwar Filadelfijsk")
                .city("Toruń")
                .region("Kujawsko-Pomorskie")
                .country("Polska")
                .street("Bulwar Filadelfijski")
                .areaColor("#A8071A")
                .description("Wisła i panorama miasta – super na ujęcia rzeki i mostów.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
                .timeZone("Europe/Warsaw")
                .build();

        var contour37 = asList(
                new BorderPoint(53.0110270002308, 18.62031701728762),
                new BorderPoint(53.010657157716764, 18.620494134103467),
                new BorderPoint(53.00844061048193, 18.61063050304716),
                new BorderPoint(53.00802342480202, 18.60850123318383),
                new BorderPoint(53.00689241881608, 18.601164721346407),
                new BorderPoint(53.00697391692003, 18.601164721346407),
                new BorderPoint(53.00779515845693, 18.606571993568593),
                new BorderPoint(53.00845875192687, 18.610137726468537),
                new BorderPoint(53.00951515603347, 18.614592637098866),
                new BorderPoint(53.010624703426316, 18.618291252974018),
                new BorderPoint(53.010781416860766, 18.618666323879467),
                new BorderPoint(53.01080022243468, 18.619239348873265),
                new BorderPoint(53.0110270002308, 18.62031701728762)
        );

        Spot spot38 = Spot.builder()
                .name("Park Tysiąclecia")
                .city("Toruń")
                .region("Kujawsko-Pomorskie")
                .country("Polska")
                .street("Podgórska")
                .areaColor("#A8071A")
                .description("Miejski park z przestrzenią – dobry na krótsze loty i trening stabilnych ujęć.")
                .rating(5.0)
                .ratingCount(0)
                .author(pickAuthor.get())
                .timeZone("Europe/Warsaw")
                .build();

        var contour38 = asList(
                new BorderPoint(52.999141947426494, 18.613398123612797),
                new BorderPoint(52.99862149079604, 18.611067411176265),
                new BorderPoint(52.99730762724852, 18.612607157853347),
                new BorderPoint(52.996945831715436, 18.613197745619942),
                new BorderPoint(52.99686966384877, 18.61353522434419),
                new BorderPoint(52.996921914785815, 18.61569104977241),
                new BorderPoint(52.99685844153757, 18.61597579744617),
                new BorderPoint(52.99656011602096, 18.617093695718637),
                new BorderPoint(52.996280830690665, 18.617979577368487),
                new BorderPoint(52.996299872929654, 18.6181588629411),
                new BorderPoint(52.996629937071276, 18.618749450707725),
                new BorderPoint(52.99690922014361, 18.618992013539753),
                new BorderPoint(52.99731544684249, 18.618939282489805),
                new BorderPoint(52.99775975291848, 18.619097475640956),
                new BorderPoint(52.99823461989581, 18.62000694374541),
                new BorderPoint(52.99844407458528, 18.620650262563203),
                new BorderPoint(52.99864083412558, 18.620376061100103),
                new BorderPoint(52.99884393980739, 18.619648372601404),
                new BorderPoint(52.999382843363264, 18.620030235837078),
                new BorderPoint(53.00006196257203, 18.619808765423983),
                new BorderPoint(53.00062682929027, 18.619640026062115),
                new BorderPoint(53.0007981918898, 18.619502925329925),
                new BorderPoint(53.000271408397055, 18.618005363493268),
                new BorderPoint(52.99968749629207, 18.618522127789674),
                new BorderPoint(52.99964306787382, 18.617984271073055),
                new BorderPoint(52.99940823118945, 18.616085953251883),
                new BorderPoint(52.99923051609238, 18.615326626123476),
                new BorderPoint(52.999109923288756, 18.61498914739971),
                new BorderPoint(52.99891951291309, 18.61467276109616),
                new BorderPoint(52.99882430741033, 18.614282551321224),
                new BorderPoint(52.99886238963663, 18.61389234154626),
                new BorderPoint(52.99898933014833, 18.613670871134445),
                new BorderPoint(52.999141947426494, 18.613398123612797)
        );

        List<SpotMedia> spotMedia11 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/d24fff27-fede-4a03-95cd-60489edc6bb0.jpg", "1803-Zamek-Krolewski-na-Wawelu.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot11, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/ac874799-1392-4714-8aff-f55df7740ef4.jpg", "Wawel_(4).jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot11, new HashSet<>())
        );

        List<SpotMedia> spotMedia12 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/44b0f921-aee0-4b6c-bd3a-85215b06edac.jpg", "Sukiennice_and_Main_Market_Square_Krakow_Poland (1).JPG", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot12, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/48d6d75c-140e-4d42-8eb8-b37bca8c38be.jpg", "st_marys_basilica_mariacki_by_night_church_sukiennice-264866-1.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot12, new HashSet<>())
        );

        List<SpotMedia> spotMedia13 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/7f212b56-45e5-4c59-a41f-9a7688334e32.jpg", "2J7A2851.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot13, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/7b34472c-0c53-4c82-bbcb-9defff531e99.jpg", "2J7A2894 (1).jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot13, new HashSet<>())
        );

        List<SpotMedia> spotMedia14 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/c732d65b-2c67-4286-90df-ce61b5e92357.jpg", "tlo12.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot14, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/01b89e3f-c2ad-43ad-ba29-b472687b81e5.jpg", "1200px-Przelecz_pod_chlopkiem.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot14, new HashSet<>())
        );

        List<SpotMedia> spotMedia15 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/510adf18-06a8-497a-ab9b-5c5a9cf18087.jpg", "442723702.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot15, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/244dbcae-11b8-41fc-b493-31819edb5dba.jpg", "Dębki,_plaża_(HB2).jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot15, new HashSet<>())
        );

        List<SpotMedia> spotMedia16 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/be0957c9-2dda-4e1a-917b-80965f4cedb0.jpg", "img-6286.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot16, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/1ad7fd70-bd26-4be2-9de8-1069a08c79fe.jpg", "img", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot16, new HashSet<>())
        );

        List<SpotMedia> spotMedia17 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/0849223a-bdbc-4777-87a3-c1f68f9f627d.jpg", "jastrzebia3_1280x768.jpg", "", 0, 2, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot17, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/8a285061-11cf-481f-8936-90371dbf7e91.jpg", "Zdjecie-komunikat.jpg", "", 0, 2, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot17, new HashSet<>())
        );

        List<SpotMedia> spotMedia18 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/97a40a44-0a56-42df-b2fc-5c38b309ac63.jpg", "Miedzywodzie-2 (1).png", "", 0, 2, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot18, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/744817a9-50c2-42a0-b404-772bd7b640c9.jpg", "Miedzywodzie-2 (1).png", "", 0, 2, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot18, new HashSet<>())
        );

        List<SpotMedia> spotMedia19 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/99e01439-12ff-4e84-ba50-f10a756abe4b.jpg", "Pustynia Błędowska, fot. M. Wróblewski, arch. UM w Dąbrowie Górniczej.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot19, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/7e2fb90a-24fa-448e-b1fe-d3ce8ab1b640.jpg", "z32223507AMP,Pustynia-Bledowska.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot19, new HashSet<>())
        );

        List<SpotMedia> spotMedia20 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/48221ad2-8d89-441e-89e1-2ac9bea36dd2.jpg", "skaryszewski-park.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot20, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/00b9581a-6a7e-46b5-a765-df2ce8d83ac2.jpg", "Warszawa,_Park_Skaryszewski_z_góry.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot20, new HashSet<>())
        );

        List<SpotMedia> spotMedia21 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/1c3933cf-42dc-4a2c-b8ce-aeec9fd3023e.jpg", "ee942152895ab17379319f19b18980a9_XL.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot21, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/3cf7d467-1977-49db-bdbd-5f06d660600d.jpg", "noresize.jpg", "", 0, 2, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot21, new HashSet<>())
        );

        List<SpotMedia> spotMedia22 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/9f488362-3c16-4822-aba8-cf7858418c19.jpg", "3666.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot22, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/aced8e7e-ed19-43c2-b251-d5f92f3af922.jpg", "Nowa_Huta_meadows,_Kraków,_Poland.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot22, new HashSet<>())
        );

        List<SpotMedia> spotMedia23 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/5b519ef5-54bd-4be1-b09a-6b68946856bf.jpg", "409931191_10231587124130670_4259959322624058222_n.png", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot23, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/70ef6be7-aa68-4e97-86e5-81c401e57957.jpg", "Pole_Mokotowskie_Pond_Warsaw_2024_aerial.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot23, new HashSet<>())
        );

        List<SpotMedia> spotMedia24 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/5436be32-5d49-46d3-9c4f-dc697f1ac9c2.jpg", "Park-Cytedela-w-Poznaniu-3.jpg", "", 0, 2, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot24, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/c3d1bab8-ccc4-42bc-87bf-749e06e616a1.jpg", "Park-Cytadela-w-Poznaniu-1.jpg", "", 0, 4, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot24, new HashSet<>())
        );

        List<SpotMedia> spotMedia25 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/018131ee-c060-4ea8-9f95-c228be0682c9.jpg", "dronj1.jpg", "", 0, 4, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot25, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/5a815628-df96-4837-909a-de6ca6a99e58.jpg", "thumb_986162_document_big.jpeg", "", 0, 6, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot25, new HashSet<>())
        );

        List<SpotMedia> spotMedia26 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/7476c7d1-c5b0-4c32-a8d4-fa6b0cbf80a3.jpg", "jasne-blonia-5.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot26, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/0f81e6a8-7ac4-496e-80d8-175508385cf5.jpg", "Szczecin_PCP_i_Jasne_Blonia_dron_(1).jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot26, new HashSet<>())
        );

        List<SpotMedia> spotMedia27 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/6c8f0bf1-a35a-440a-aa28-d1ff9d906dc8.jpg", "park-grabiszynski-wroclaw-18.png", "", 0, 4, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot27, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/8225c4be-4ed2-45ee-a7a8-2a64e50831aa.jpg", "Wrocław,_Cmentarz_Grabiszyński_III_-_fotopolska.eu_(209067).jpg", "", 0, 2, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot27, new HashSet<>())
        );

        List<SpotMedia> spotMedia28 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/3fad4fb5-33df-4208-a997-cb29a62874a5.jpg", "1000yers_park_Poznan.jpg", "", 0, 4, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot28, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/529b471f-72e0-4d01-85d9-1864d3843658.jpg", "ParkTysiąclecia-WidokOdPółnocy-OsiedleTysiąclecia-POL,_Kraków.jpg", "", 0, 4, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot28, new HashSet<>())
        );

        List<SpotMedia> spotMedia29 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/13432dfe-5803-4948-8c5e-89a977bf871a.jpg", "z26357417AMP,Bulwary-nad-Wislokiem--potezny-teren--na-ktory-wci.jpg", "", 0, 6, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot29, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/e75da5cd-08b2-48c5-8a0b-984cdee62ccc.jpg", "bulwary-rzeszow .png", "", 0, 6, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot29, new HashSet<>())
        );

        List<SpotMedia> spotMedia30 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/4f18b5bc-be33-4c45-ba24-65a46ab600b0.jpg", "klomb-w-parku-na-zdrowiu.png", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot30, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/0b60ff35-14c6-4e04-8ecf-e9660c97c784.jpg", "IMG_4429.JPG", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot30, new HashSet<>())
        );

        List<SpotMedia> spotMedia31 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/9ccd5f4e-0c2d-4761-a5cc-e78e77503bb1.jpg", "jezioro-p.morawski-1.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot31, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/10bce221-49ef-4f76-98cf-11a19fbfa874.jpg", "7.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot31, new HashSet<>())
        );

        List<SpotMedia> spotMedia32 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/fe348e54-0022-41f0-83c4-f5c488f7fb66.jpg", "c6382b9c54e0183be182a0eb446847dc.png", "", 0, 4, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot32, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/7c76d8b3-3131-48a2-a10b-540995a69917.jpg", "c6382b9c54e0183be182a0eb446847dc.png", "", 0, 4, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot32, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/32ca9744-7dcd-4a50-9da4-a5faca8f95a5.jpg", "okolica-zamek-krokowa-jezioro-zarnowieckie-elektrownia-gniewino.jpg", "", 0, 2, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 14), pickAuthor.get(), spot32, new HashSet<>())
        );

        // ===================== MEDIA 33-38 (z CSV 2025-12-15) =====================

        List<SpotMedia> spotMedia33 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/61532466-8bb1-49e0-8ef3-737a4ff8525e.jpg", "polwysep_helski.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 15), pickAuthor.get(), spot33, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/df996c1c-f421-4343-813b-a93b9421fdf7.jpg", "20110817-1140x650.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 15), pickAuthor.get(), spot33, new HashSet<>())
        );

        List<SpotMedia> spotMedia34 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/bc0b9cc0-083b-4323-9aca-857320b9c1e3.jpg", "Bydgoszcz_myslecinek_park.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 15), pickAuthor.get(), spot34, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/4b85ffe1-b678-4821-8954-2ce614c2e6de.jpg", "myslecinek-jesien-m.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 15), pickAuthor.get(), spot34, new HashSet<>())
        );

        List<SpotMedia> spotMedia35 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/85650462-ebe5-4079-a952-26ec7a1cf0d4.jpg", "gf-uuge-ifBQ-nuZY_park-konstytucji-3-maja-1920x1080-nocrop.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 15), pickAuthor.get(), spot35, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/0d9dcb5d-318c-450d-baa9-a71299ea9b86.jpg", "0x0.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 15), pickAuthor.get(), spot35, new HashSet<>())
        );

        List<SpotMedia> spotMedia36 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/48ad1137-d629-4f89-9e12-70eeb8323a32.jpg", "20210122_160246_Park_Antoniuk_in_Białystok.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 15), pickAuthor.get(), spot36, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/02df7983-16c5-4ac2-b419-82daf70e965f.jpg", "20210122_160246_Park_Antoniuk_in_Białystok.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 15), pickAuthor.get(), spot36, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/627481cc-9689-4247-b4b9-d06d5d1d3f29.jpg", "20210122_160246_Park_Antoniuk_in_Białystok.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 15), pickAuthor.get(), spot36, new HashSet<>())
        );

        List<SpotMedia> spotMedia37 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/1ea120ec-060e-4cdb-8e86-637a01a78e79.jpg", "torunbulwar180114.png", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 15), pickAuthor.get(), spot37, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/c971b0ed-74a7-4ce8-a419-11e822f10ef7.jpg", "Toruń_(DerHexer)_2010-07-17_011.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 15), pickAuthor.get(), spot37, new HashSet<>())
        );

        List<SpotMedia> spotMedia38 = Arrays.asList(
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/5f46e90d-1e50-4bec-9369-79b82c5111e6.jpg", "2020_05_17_parki_zielen_1000lecia_019_1.jpg.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 15), pickAuthor.get(), spot38, new HashSet<>()),
                new SpotMedia(null, null, "https://merkurystorage.blob.core.windows.net/mapa/bd1b8879-af87-4387-8039-9743ea417e6c.jpg", "2020_05_17_parki_zielen_1000lecia_020_1.jpg.jpg", "", 0, 0, GenericMediaType.PHOTO, LocalDate.of(2025, 12, 15), pickAuthor.get(), spot38, new HashSet<>())
        );

        spot11.getTags().addAll(Set.of(city, oldTown, monument, photography));
        spot12.getTags().addAll(Set.of(city, oldTown, photography));
        spot13.getTags().addAll(Set.of(city, park, photography));
        spot14.getTags().addAll(Set.of(mountains, lake, countryside, photography));
        spot15.getTags().addAll(Set.of(beach, countryside, photography));
        spot16.getTags().addAll(Set.of(beach, countryside, photography));
        spot17.getTags().addAll(Set.of(beach, countryside, fpv, photography));
        spot18.getTags().addAll(Set.of(beach, countryside, photography));
        spot19.getTags().addAll(Set.of(countryside, photography));
        spot20.getTags().addAll(Set.of(city, park, photography));
        spot21.getTags().addAll(Set.of(city, grassland, fpv, photography));
        spot22.getTags().addAll(Set.of(city, grassland, photography));
        spot23.getTags().addAll(Set.of(city, park, grassland, fpv, photography));
        spot24.getTags().addAll(Set.of(city, park, ruins, photography));
        spot25.getTags().addAll(Set.of(city, park, fpv, photography));
        spot26.getTags().addAll(Set.of(city, park, grassland, fpv, photography));
        spot27.getTags().addAll(Set.of(city, park, forest, fpv, photography));
        spot28.getTags().addAll(Set.of(city, park, fpv, photography));
        spot29.getTags().addAll(Set.of(city, river, photography));
        spot30.getTags().addAll(Set.of(city, park, forest, fpv, photography));
        spot31.getTags().addAll(Set.of(lake, countryside, fpv, photography));
        spot32.getTags().addAll(Set.of(lake, countryside, fpv, photography));
        spot33.getTags().addAll(Set.of(beach, countryside, photography));
        spot34.getTags().addAll(Set.of(city, park, forest, fpv, photography));
        spot35.getTags().addAll(Set.of(city, park, forest, fpv, photography));
        spot36.getTags().addAll(Set.of(city, park, fpv, photography));
        spot37.getTags().addAll(Set.of(city, river, oldTown, photography));
        spot38.getTags().addAll(Set.of(city, park, fpv, photography));

        // ===================== ZAPIS =====================

        var spots = new ArrayList<>(List.of(
                spot1, spot2, spot3, spot4, spot5, spot6, spot7, spot8, spot9, spot10,
                spot11, spot12, spot13, spot14, spot15, spot16, spot17, spot18, spot19, spot20,
                spot21, spot22, spot23, spot24, spot25, spot26, spot27, spot28, spot29, spot30,
                spot31, spot32, spot33, spot34, spot35, spot36, spot37, spot38
        ));

        var contours = List.of(
                contour1, contour2, contour3, contour4, contour5, contour6, contour7, contour8, contour9, contour10,
                contour11, contour12, contour13, contour14, contour15, contour16, contour17, contour18, contour19, contour20,
                contour21, contour22, contour23, contour24, contour25, contour26, contour27, contour28, contour29, contour30,
                contour31, contour32, contour33, contour34, contour35, contour36, contour37, contour38
        );

        List<List<SpotMedia>> spotMediaList = List.of(spotMedia1, spotMedia2, spotMedia3, spotMedia4, spotMedia5, spotMedia6, spotMedia7, spotMedia8, spotMedia9, spotMedia10,
                spotMedia11, spotMedia12, spotMedia13, spotMedia14, spotMedia15, spotMedia16,
                spotMedia17, spotMedia18, spotMedia19, spotMedia20, spotMedia21, spotMedia22, spotMedia23, spotMedia24, spotMedia25,
                spotMedia26, spotMedia27, spotMedia28, spotMedia29, spotMedia30, spotMedia31, spotMedia32, spotMedia33, spotMedia34,
                spotMedia35, spotMedia36, spotMedia37, spotMedia38);

        for (var medias : spotMediaList) {
            for (var m : medias) {
                applyRandomLikesToMedia(m, authors, rnd);
                applyRandomViewsToMedia(m, rnd);
            }
        }

        for (int i = 0; i < spots.size(); i++) {
            Spot spot = spots.get(i);
            spot.getBorderPoints().addAll(contours.get(i));
            spot.setMedia(spotMediaList.get(i));
            topUpCommentsFromPool(
                    spot,
                    COMMENTS_PER_SPOT[i],
                    commentTexts,
                    textIdx,
                    authors,
                    rnd
            );
            recalcRatingAndCount(spot);
            applyRandomViewsToSpot(spot, rnd);


            spot.setArea(PolygonAreaCalculator.calculateArea(spot.getBorderPoints().toArray(new BorderPoint[0])));
            spot.setCenterPoint(PolygonCenterPointCalculator.calculateCenterPoint(spot.getBorderPoints()));
        }

        for (Spot spot : spots) {
            var firstComment = spot.getSpotComments().getFirst();
            var mediaList = spot.getMedia().stream()
                    .map(media -> SpotCommentMedia.builder()
                            .url(media.getUrl())
                            .spotComment(firstComment)
                            .genericMediaType(media.getGenericMediaType())
                            .build())
                    .collect(Collectors.toSet());
            firstComment.setMedia(mediaList);
            spotCommentRepository.save(firstComment);
        }


        spotRepository.saveAll(spots);
    }

    private static void applyRandomViewsToMedia(SpotMedia media, Random rnd) {
        if (media == null) return;

        int likes = media.getLikes();
        int base = 20 + rnd.nextInt(800);

        int multiplier = (media.getGenericMediaType() == GenericMediaType.VIDEO) ? 300 : 120;

        int views = base + likes * (10 + rnd.nextInt(multiplier));

        if (views < likes) views = likes + rnd.nextInt(100);

        media.setViews(views);
    }

    private static void applyRandomViewsToSpot(Spot spot, Random rnd) {
        if (spot == null) return;

        int base = 100 + rnd.nextInt(50_000);

        int bonus = 0;
        bonus += spot.getRatingCount() * 25;
        if (spot.getMedia() != null) bonus += spot.getMedia().size() * 200;
        if (spot.getSpotComments() != null) bonus += spot.getSpotComments().size() * 40;

        int views = base + bonus;

        spot.setViewsCount(views);
    }


    private static final List<String> commentTexts = List.of(
            "Świetny spot na spokojne ujęcia z drona o świcie – mało ludzi i miękkie światło.",
            "Nad wodą bywa porywisty wiatr, ale panorama z wysokości wygląda tu rewelacyjnie.",
            "Złota godzina robi robotę: niskie słońce, długie cienie i super plastyka kadru.",
            "Dobre miejsce na orbit wokół charakterystycznego punktu – ustaw wolny tryb Cine.",
            "Przy drzewach czuć turbulencje; startuj z otwartej polany i trzymaj zapas wysokości.",
            "Na zdjęciach z góry świetnie wychodzi geometryczny układ alejek – warto zrobić top-down.",
            "Polecam zrobić panoramę 180° i potem skleić – wychodzi bardzo czysto i szczegółowo.",
            "Fajny kadr na „reveal”: start nisko za drzewami i powolne wynurzenie nad linię horyzontu.",
            "Uwaga na ptaki, zwłaszcza wiosną – lepiej ominąć ich miejsca gniazdowania.",
            "Piasek potrafi wlecieć w silniki; landing pad to tutaj must-have.",
            "Świetny spot na hyperlapse wzdłuż brzegu – stabilny kierunek i powtarzalny rytm fal.",
            "Jeśli kręcisz wideo, ND 16 pomaga utrzymać 1/50–1/60 przy 25–30 fps.",
            "Dobre tło do portretu miejsca z drona: szeroki plan + jedno mocne „leading line”.",
            "Na zachodzie słońca woda łapie fajne refleksy – koniecznie spróbuj ujęć pod kątem.",
            "Przy mokrej nawierzchni po deszczu kolory robią się głębsze, a kontrast przyjemniejszy.",
            "Łatwy start i lądowanie, dużo przestrzeni – dobre na trening płynnych ruchów gimbala.",
            "Na filmie ładnie wychodzi powolny „pull-away” od obiektu do szerokiej panoramy.",
            "Jeśli robisz zdjęcia, włącz RAW – łatwiej odzyskać niebo i cienie.",
            "Świetny punkt na „parallax”: leć bokiem, a tło będzie pięknie pracować.",
            "W weekend bywa tłoczno; najlepsze kadry złapiesz wcześnie rano albo poza sezonem.",
            "Dobre miejsce na ujęcia z niskiego pułapu nad trawą – wygląda bardzo filmowo.",
            "Sprawdź strefy i ograniczenia lotu, zanim wystartujesz – czasem zaskakuje geofencing.",
            "RTH ustaw trochę wyżej niż korony drzew – okolica ma sporo przeszkód.",
            "Fajne kadry mostu z boku; zrób też wersję pionową pod rolki.",
            "Świetnie wychodzą kadry symetryczne – ustaw horyzont idealnie i leć powoli.",
            "W pochmurny dzień masz miękkie światło bez przepaleń – idealne na zdjęcia detali.",
            "Zimą, przy niskim słońcu, cienie rysują teren jak na mapie – super efekt z góry.",
            "Przy wietrze trzymaj się bliżej brzegu i nie oddalaj za bardzo – bezpieczeństwo przede wszystkim.",
            "Na dłuższe ujęcia weź dodatkowe baterie – tutaj chce się latać dłużej.",
            "Dobre miejsce na „tracking shot” wzdłuż ścieżki – równy kierunek i mało przeszkód.",
            "Jeśli robisz panoramy, zablokuj ekspozycję, żeby nie skakała między klatkami.",
            "Wieczorem lampy dają fajny klimat, ale uważaj na szumy – lepiej krótkie ujęcia.",
            "Przy liniach energetycznych zachowaj duży dystans; na mapie nie zawsze je widać.",
            "Woda odbija niebo – polaryzator potrafi zrobić różnicę na zdjęciach.",
            "Świetne miejsce na szybki test ustawień: dużo różnych planów w jednym locie.",
            "Najlepsze ujęcia robią się tu po lekkiej mgle – przestrzeń wygląda wtedy magicznie.",
            "Do timelapse z powietrza wybierz stabilny punkt i wolny, stały ruch w osi.",
            "Dobre kadry „z góry na dół” pokazują skalę miejsca – szczególnie przy długich alejach.",
            "Jeśli latasz FPV, trzymaj niski profil i omijaj ludzi – polany są wystarczające.",
            "Na filmie świetnie wygląda powolny „dolly-in” do charakterystycznego obiektu.",
            "Ujęcia nad rzeką są super, ale wiatr potrafi kręcić – lepiej latać wcześnie rano.",
            "Po deszczu robią się kałuże, które odbijają niebo – fajne na kreatywne kadry.",
            "Dobre miejsce na test trybu ActiveTrack, ale tylko gdy jest mało przechodniów.",
            "Na zdjęciach dobrze wygląda układ 1:1 – spróbuj kwadratu z lotu.",
            "Zrób serię bracketingu i złoż HDR – niebo i ziemia będą idealnie zbalansowane.",
            "Świetna miejscówka na „establishing shot” na początek filmu z podróży.",
            "Uważaj na latawce przy plaży – potrafią pojawić się nagle w przestrzeni.",
            "Przy klifie trzymaj zapas od krawędzi i licz się z podmuchami od morza.",
            "Dobry spot na długą panoramę miasta – ustaw stały balans bieli dla spójności.",
            "Jeśli chcesz ostre zdjęcia, leć wolniej i unikaj gwałtownych skrętów w wietrze.",
            "Fajny pomysł: ujęcie pionowe wzdłuż falochronu – wygląda świetnie na telefonie.",
            "Z poziomu drona ładnie wychodzi kontrast zieleni i wody – szczególnie latem.",
            "Świetny spot na ujęcia „follow me”, ale tylko z asekuracją i dużym dystansem.",
            "Podczas zachodu słońca pilnuj ekspozycji – łatwo przepalić niebo.",
            "Przy wysokiej wilgotności soczewka potrafi zaparować – miej mikrofibrę.",
            "Na zdjęciach dobrze działa linia brzegowa jako prowadząca linia – leć równolegle.",
            "Jeśli masz czas, zrób dwa loty: jeden niski cinematic, drugi wysoki na panoramy.",
            "Fajny spot na „spiral up” – powoli w górę, z gimbalem lekko w dół.",
            "Zadbaj o kalibrację kompasu, jeśli startujesz blisko metalowych elementów.",
            "Tu często są dobre warunki na długie, spokojne ujęcia bez drgań.",
            "W kadrze dobrze wygląda most jako „frame” – wleć pod kątem i utrzymaj linię.",
            "Na zdjęciach nocnych lepiej zostać na ziemi; z drona łatwo o poruszenie.",
            "Przy ścieżkach spacerowych trzymaj wysokość i dystans – nie psuj ludziom spaceru.",
            "Dobra miejscówka na test ostrości: dużo detali i kontrastów w jednym ujęciu.",
            "Ujęcia nad łąkami są świetne – fale trawy robią piękny ruch w wietrze.",
            "Jeśli robisz wideo, ustaw ręcznie ISO jak najniżej i pracuj filtrem ND.",
            "Tu warto zrobić „bird’s eye” z idealną symetrią – wychodzi jak plan miasta.",
            "Zadbany teren, łatwo znaleźć bezpieczne miejsce do startu i lądowania.",
            "Na wiosnę kolory są soczyste, a światło miękkie – idealne na zdjęcia krajobrazowe.",
            "W lecie tłum potrafi wejść w kadr; lepiej celować w dni powszednie.",
            "Przy zachodzie słońca zrób ujęcie pod słońce i drugie z plecami – dwa klimaty.",
            "Jeśli masz możliwość, ustaw „custom” RTH i wracaj po zaplanowanej trasie.",
            "Fajny spot na ujęcia łodzi, ale nie zniżaj nad wodę zbyt nisko.",
            "Na zdjęciach z wysokości widać fale i struktury – spróbuj krótkiej ogniskowej.",
            "Przy skrajnych temperaturach baterie szybciej siadają – planuj krótsze loty.",
            "Tu dobrze działa ujęcie „push forward” wzdłuż alei – powolny, równy ruch.",
            "Zrób serię zdjęć co 2–3 sekundy i złóż timelapse – chmury robią klimat.",
            "Jeśli latasz w mieście, trzymaj się otwartych przestrzeni i unikaj zabudowy.",
            "Fajny kadr „top-down” nad wodą, gdy widać płycizny i zmiany koloru.",
            "Uważaj na mokry piasek – wygląda twardo, a potrafi wciągnąć przy lądowaniu.",
            "Świetny spot na zdjęcia architektury z góry – proste linie i czytelna forma.",
            "Na filmie dodaj delikatny tilt gimbala podczas lotu – daje efekt premium.",
            "Przy silniejszym wietrze leć krótsze odcinki i unikaj gwałtownych yaw.",
            "Tu łatwo złapać kadr bez ludzi – wystarczy przejść kawałek dalej.",
            "Sprawdź satelity przed startem – pod drzewami łapie je wolniej.",
            "Fajna miejscówka na ujęcia zimowe: śnieg robi świetny kontrast w kadrze.",
            "Jeśli robisz panoramy, ustaw stałą ekspozycję i stały balans bieli.",
            "Na rzece dobrze wygląda „S-curve” nurtu – spróbuj ujęcia z boku i z góry.",
            "Przy klifie wiatr potrafi zmienić kierunek – nie ryzykuj na niskiej baterii.",
            "Fajne miejsce na spokojne testy FPV: szeroko, czytelnie, bez ciasnych przeszkód.",
            "Jeśli kręcisz pod rolki, spróbuj pionu 9:16 – linia brzegu wygląda świetnie.",
            "Ujęcia „reveal” zza drzew są tu bardzo efektowne, ale pilnuj wysokości koron.",
            "Na zdjęciach z góry warto zostawić trochę „negative space” – wygląda nowocześnie.",
            "Świetny spot na „establishing shot” miasta: najpierw szeroko, potem zbliżenie.",
            "Jeśli robisz zdjęcia do aplikacji, dorzuć ujęcie „context” i ujęcie „detail”.",
            "Warto nagrać krótki przelot i zakończyć statycznym kadrem – łatwiej montować.",
            "Przy niskim słońcu unikaj lotu pod słońce bez osłony – flary psują materiał.",
            "Tu dobrze działa ujęcie „orbit + tilt up” – pokazuje i teren, i horyzont.",
            "Na zdjęciach świetnie wyglądają łuki i zakręty ścieżek – szukaj takich linii.",
            "Jeśli masz filtr ND, dobierz go do warunków: ND8 rano, ND16 w południe.",
            "Uważaj na psy biegające luzem – potrafią podejść pod miejsce lądowania.",
            "Świetne miejsce na spokojne ujęcia „hover” i zdjęcia z jednego punktu.",
            "Przy starych drzewach bywają gałęzie niewidoczne z daleka – nie lataj zbyt nisko.",
            "Jesienią kolory z góry wyglądają fenomenalnie – koniecznie złap złotą porę liści.",
            "Na filmie dobrze wygląda „crane up” – start nisko i płynny wzlot.",
            "Tu można zrobić świetne ujęcie „leading lines” z promenady/ścieżki.",
            "Jeśli chcesz minimalizmu, ustaw kadr na wodę i jeden akcent w rogu.",
            "Fajny spot na „top-down” nad piaskiem – wzory na plaży są super.",
            "Jeżeli nagrywasz, trzymaj stały shutter i kontroluj ekspozycję filtrem ND.",
            "Tu często trafisz na piękne chmury – timelapse z lekkim ruchem jest petarda.",
            "Świetne miejsce na zdjęcia w pionie: ścieżka w środku, drzewa po bokach, symetria.",
            "Na filmie fajnie działa „slide” w bok wzdłuż linii brzegowej.",
            "Jeśli masz profil płaski, nagraj z poprawną ekspozycją i popraw kolory w postprodukcji.",
            "Przy otwartej przestrzeni łatwo o dalekie loty – pilnuj baterii i sygnału.",
            "Tu warto zrobić ujęcie „mapowe” z góry: prosto w dół, bez horyzontu.",
            "Uważaj na metalowe barierki przy starcie – potrafią zakłócić kompas.",
            "Fajna miejscówka na ujęcia z ruchem ludzi jako „scale”, ale tylko z dystansu.",
            "Na zdjęciach świetnie wygląda kontrast piasku i wody – polaryzator pomaga.",
            "Jeśli chcesz filmowy look, leć wolno i rób łagodne łuki, bez szarpania yaw.",
            "Przy silnym słońcu unikaj południa – twarde cienie psują wideo i zdjęcia.",
            "Tu świetnie działa „push over” przez linię drzew na otwartą przestrzeń.",
            "Jeśli robisz zdjęcia miejsca, dodaj 3 wysokości: nisko, średnio, wysoko.",
            "Ujęcia z rzeką najlepiej wychodzą pod kątem 30–45° – widać i nurt, i brzegi.",
            "Przy latarniach i masztach pilnuj przeszkód – z daleka wyglądają niżej niż są.",
            "Fajny spot na „slow yaw” z gimbalem w dół – wygląda bardzo spokojnie.",
            "Tu zwykle jest sporo otwartej przestrzeni – dobre miejsce na pierwsze loty.",
            "Ujęcia o świcie są tu najczystsze, bo powietrze jest spokojniejsze.",
            "Po wietrznym dniu fale na wodzie robią fajną teksturę – warto to złapać z góry.",
            "Jeśli kręcisz FPV, spróbuj niskiego przelotu wzdłuż polany, ale zachowaj margines.",
            "Tu łatwo znaleźć punkt bez ludzi do startu – wystarczy odejść od głównej ścieżki.",
            "Na filmie ładnie wygląda orbit wokół obiektu, ale leć szeroko i bezpiecznie.",
            "Zrób jedno ujęcie w 4K szeroko i jedno bliżej – przydaje się w montażu.",
            "Przy długich ujęciach sprawdza się tryb Cine i łagodne ruchy na drążkach.",
            "Tu warto trzymać horyzont idealnie prosto – panorama wtedy wygląda premium.",
            "W porannym świetle mgiełka nad wodą wygląda świetnie – idealne na cinematic.",
            "Uważaj na mewy i wrony – czasem podlatują z ciekawości do drona.",
            "Przy klifie trzymaj stałą wysokość i stabilny yaw – kadr wygląda wtedy płynnie.",
            "Na zdjęciach z góry dobrze działają powtarzalne wzory (alejki, fale, polany).",
            "Jeśli chcesz kadr „pocztówkowy”, ustaw słońce za plecami i weź szeroki plan.",
            "Tu można zrobić świetny „pull-up” od ziemi do pełnej panoramy miejsca.",
            "Przy lądowaniu na trawie uważaj na wysokie źdźbła – potrafią zahaczyć o śmigła.",
            "Sprawdź wiatr na wysokości, nie tylko na ziemi – różnica bywa spora.",
            "Jeśli nagrywasz, wyłącz automatyczny balans bieli – inaczej kolory „pływają”.",
            "Tu fajnie wychodzi przelot po skosie przez przestrzeń – wygląda dynamicznie.",
            "Warto zrobić też kilka zdjęć z większej wysokości jako „mapa” miejsca w aplikacji.",
            "Przy zachodzie słońca spróbuj sylwetek z góry (z bezpiecznego dystansu).",
            "Tu dobrze działają ujęcia „slow reveal” nad linią lasu – efekt wow gwarantowany.",
            "Na zdjęciach podbij lekko kontrast lokalny – detale z góry ożywają.",
            "Jeśli latasz nad wodą, ustaw RTH na bezpieczny punkt na lądzie.",
            "Na filmie super wygląda przejście: woda → plaża → las, jednym płynnym przelotem.",
            "Przy wysokich budynkach sygnał bywa kapryśny – lepiej trzymać się otwartej strony.",
            "Tu łatwo zrobić komplet materiału: kilka klipów i parę zdjęć – i gotowe.",
            "Jeśli robisz panoramę, pamiętaj o zakładce – łatwiej skleić bez artefaktów.",
            "Fajny spot na „top-down” nad ścieżką w lesie – wygląda jak tunel zieleni.",
            "Na zdjęciach z góry widać fajne przejścia kolorów wody – bardzo fotogeniczne.",
            "Jeśli chcesz filmowy klimat, dodaj delikatny „tilt down” na końcu ujęcia.",
            "Tu można zrobić super minimal: jeden pomost i pusta woda dookoła.",
            "Przy lądowaniu uważaj na piach i kurz – po locie warto przetrzeć sprzęt.",
            "Tu dobrze wychodzą ujęcia z dalszej perspektywy – oddal się i pokaż skalę.",
            "Fajna miejscówka na „establishing shot”: pokaż całe miejsce w 3–5 sekund.",
            "Jeśli latasz blisko ludzi, utrzymuj bezpieczny dystans i nie przelatuj nad nimi.",
            "Tu często jest dużo przestrzeni na manewry – idealne na ćwiczenie płynnych łuków.",
            "Na zdjęciach przyda się lekkie „dehaze”, szczególnie przy wilgoci nad wodą.",
            "Przy zachmurzeniu miękkie światło daje świetne RAW-y bez przepaleń.",
            "Tu warto zrobić ujęcie „push through” między planami – daje fajną głębię.",
            "Jeśli chcesz mocny kadr, spróbuj czarno-białej obróbki – wzory z góry robią wrażenie.",
            "Przy lądowaniu na ścieżce uważaj na żwir – potrafi odbić się w śmigła.",
            "Zrób szybki test ekspozycji przed właściwym lotem – oszczędzisz czas w montażu.",
            "Tu najlepiej działa spokojny styl: wolno, płynnie, bez gwałtownych zmian kierunku.",
            "Na zdjęciach z góry fajnie wygląda „frame” z drzew – ustaw obiekt w środku.",
            "Tu wschód słońca daje piękne pasy światła – idealne na cinematic i zdjęcia.",
            "Uważaj na rowerzystów na ścieżkach – nie ląduj na trasie przejazdu.",
            "Jeśli latasz zimą, baterie trzymaj w cieple i startuj dopiero po rozgrzaniu.",
            "Tu widać świetnie granice kolorów: trawa–piasek–woda, bardzo fotogeniczne.",
            "Jeśli robisz zdjęcia do aplikacji, dorzuć też kadr z niskiej wysokości na detale.",
            "Tu łatwo złapać czyste ujęcie bez przypadkowych osób – wystarczy dobra pora dnia.",
            "Przy wietrze lepiej skrócić lot i wrócić wcześniej – bezpieczeństwo ponad wszystko.",
            "Na filmie dobrze wygląda przejście: start nisko → wzlot → odjazd w stronę horyzontu.",
            "Tu warto zrobić serię 5–7 zdjęć do panoramy – teren jest szeroki i malowniczy.",
            "Jeśli kręcisz, wyłącz „auto” i ustaw ręcznie parametry – materiał będzie spójniejszy.",
            "Fajny kadr „straight down” nad wodą, gdy jest przejrzysta i widać dno.",
            "Uważaj na gałęzie wystające nad ścieżki – z góry bywają słabo widoczne.",
            "Tu można zrobić świetny kadr z mostem jako prowadzącą linią – leć wzdłuż osi.",
            "Jeśli robisz zdjęcia, spróbuj AEB i wybierz najlepszą ekspozycję w domu.",
            "Na filmie dodaj delikatne „ease in/out” na drążkach – wygląda profesjonalnie.",
            "Tu często trafisz na spokojne niebo – idealne do czystych, minimalistycznych ujęć.",
            "Przy wodzie uważaj na kondensację – po locie daj sprzętowi chwilę, zanim schowasz.",
            "Tu najładniej wychodzi niebieska godzina – delikatne światło i piękny klimat.",
            "Na zdjęciach z góry zasada trójpodziału działa świetnie – ustaw linię brzegu na 1/3.",
            "Jeśli robisz wideo, dorzuć też ujęcie statyczne 10 sekund – przydaje się w montażu.",
            "Tu można zrobić piękne zdjęcia z mgłą – nie przesadzaj z dehaze, zostaw klimat.",
            "Uważaj na sygnał wśród drzew; najlepiej startować z otwartego miejsca.",
            "Jeśli robisz „slide” wzdłuż alei, trzymaj stałą prędkość i stały tilt gimbala.",
            "Jeśli robisz zdjęcia, dodaj „overview” z większej wysokości jako okładkę miejsca.",
            "Przy brzegu morza wiatr bywa zdradliwy; lepiej krótsze, pewne przeloty.",
            "Na zdjęciach świetnie wygląda faktura fal – łap ją pod kątem, nie tylko z góry.",
            "Jeśli chcesz ostre zdjęcia, unikaj lotu bokiem przy mocnym wietrze – łatwo o poruszenie."
    );

    private static final int[] COMMENTS_PER_SPOT = new int[]{
            9, 8, 7, 5, 6, 6, 8, 8, 6, 5,
            6, 5, 4, 5, 5, 5, 6, 4, 4, 5,
            6, 5, 7, 5, 5, 4, 5, 4, 4, 5,
            4, 4, 6, 4, 4, 3, 4, 4
    };

    private static double randomRating(Random rnd) {
        int roll = rnd.nextInt(100);
        if (roll < 5) return 3.0;
        if (roll < 15) return 3.5;
        if (roll < 35) return 4.0;
        if (roll < 70) return 4.5;
        return 5.0;
    }

    private static LocalDateTime randomPublishDate(Random rnd, LocalDateTime from, LocalDateTime to) {
        long seconds = ChronoUnit.SECONDS.between(from, to);
        if (seconds <= 0) return from;
        long add = Math.floorMod(rnd.nextLong(), seconds);
        return from.plusSeconds(add);
    }

    private void topUpCommentsFromPool(
            Spot spot,
            int targetCount,
            List<String> textPool,
            AtomicInteger textIdx,
            List<UserEntity> authors,
            Random rnd
    ) {
        int missing = targetCount - spot.getSpotComments().size();
        if (missing <= 0) return;

        var from = LocalDateTime.of(2024, 1, 1, 0, 0);
        var to = LocalDateTime.of(2025, 12, 15, 23, 59);

        for (int i = 0; i < missing; i++) {
            String txt = textPool.get(Math.floorMod(textIdx.getAndIncrement(), textPool.size()));
            var author = authors.get(rnd.nextInt(authors.size()));

            SpotComment comment = SpotComment.builder()
                    .text(txt)
                    .rating(randomRating(rnd))
                    .publishDate(randomPublishDate(rnd, from, to))
                    .author(author)
                    .spot(spot)
                    .build();

            applyRandomVotes(comment, authors, author, rnd);

            spot.getSpotComments().add(comment);
        }
    }

    private void recalcRatingAndCount(Spot spot) {
        double avg = spot.getSpotComments().stream()
                .mapToDouble(SpotComment::getRating)
                .average()
                .orElse(0.0);

        spot.setRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP).doubleValue());
        spot.setRatingCount(spot.getSpotComments().size());
    }

    private static void applyRandomLikesToMedia(
            SpotMedia media,
            List<UserEntity> allUsers,
            Random rnd
    ) {
        if (media == null) return;
        if (allUsers == null || allUsers.size() <= 1) return;

        UserEntity mediaAuthor = media.getAuthor();
        if (mediaAuthor == null) return;

        List<UserEntity> pool = new ArrayList<>(allUsers);
        pool.removeIf(u -> Objects.equals(u.getId(), mediaAuthor.getId()));

        if (pool.isEmpty()) return;

        Collections.shuffle(pool, rnd);

        int maxLikes = Math.min(40, pool.size());
        int likeCount = rnd.nextInt(maxLikes + 1);

        Set<UserEntity> likers = new HashSet<>(pool.subList(0, likeCount));

        media.getLikedBy().addAll(likers);
        media.setLikes(media.getLikedBy().size());
        likers.forEach(u -> u.getLikedSpotMedia().add(media));
    }


    private static void applyRandomVotes(
            SpotComment comment,
            List<UserEntity> allUsers,
            UserEntity commentAuthor,
            Random rnd
    ) {
        if (allUsers == null || allUsers.size() <= 1) return;

        List<UserEntity> pool = new ArrayList<>(allUsers);
        pool.removeIf(u -> Objects.equals(u.getId(), commentAuthor.getId()));

        if (pool.isEmpty()) return;

        Collections.shuffle(pool, rnd);

        int maxUp = Math.min(12, pool.size());
        int upCount = rnd.nextInt(maxUp + 1);

        Set<UserEntity> upvoters = new HashSet<>(pool.subList(0, upCount));

        pool.subList(0, upCount).clear();

        int maxDown = Math.min(4, pool.size());
        int downCount = rnd.nextInt(maxDown + 1);

        Set<UserEntity> downvoters = new HashSet<>(pool.subList(0, downCount));

        comment.getUpVotedBy().addAll(upvoters);
        comment.getDownVotedBy().addAll(downvoters);
        comment.setUpVotes(upvoters.size());
        comment.setDownVotes(downvoters.size());
    }
}
