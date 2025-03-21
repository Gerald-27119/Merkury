package com.merkury.vulcanus.db;

import com.merkury.vulcanus.model.embeddable.BorderPoint;
import com.merkury.vulcanus.model.entities.Comment;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.entities.PasswordResetToken;
import com.merkury.vulcanus.model.entities.Spot;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.Zone;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

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
                .areaColor("green")
                .description("Brązowy posąg XVII-wiecznego polskiego króla Jana III Sobieskiego na koniu usytuowany na małym placu.")
                .comments(new ArrayList<>())
                .rating(5.0)
                .viewsCount(100)
                .images(new ArrayList<>())
                .build();

        Spot spot2 = Spot.builder()
                .name("Skwer Czesława Niemena")
                .areaColor("green")
                .description("Mały park z ławkami i pomnikiem Czesława Niemena.")
                .comments(new ArrayList<>())
                .rating(5.0)
                .viewsCount(100)
                .images(new ArrayList<>())
                .build();

        Spot spot3 = Spot.builder()
                .name("Park Wałowy")
                .areaColor("green")
                .description("Mały park z ławkami")
                .comments(new ArrayList<>())
                .rating(3.5)
                .viewsCount(10)
                .images(new ArrayList<>())
                .build();

        Spot spot4 = Spot.builder()
                .name("Park")
                .areaColor("green")
                .description("Mały park")
                .comments(new ArrayList<>())
                .rating(3.6)
                .viewsCount(17)
                .images(new ArrayList<>())
                .build();

        Spot spot5 = Spot.builder()
                .name("Jar Wilanowski")
                .areaColor("green")
                .description("Zielona strefa z jeziorem")
                .comments(new ArrayList<>())
                .rating(4.6)
                .viewsCount(120)
                .images(new ArrayList<>())
                .build();

        Spot spot6 = Spot.builder()
                .name("Plac imienia Dariusza Kobzdeja")
                .areaColor("green")
                .description("Mały, zadbany plac z ławeczkami i zielenią. Znajduje się on z jednej strony w pobliżu pomnika Jana III Sobieskiego, a z drugiej strony w pobliżu Hali Targowej.")
                .comments(new ArrayList<>())
                .rating(4.5)
                .viewsCount(500)
                .images(new ArrayList<>())
                .build();

        Spot spot7 = Spot.builder()
                .name("Plac Zabaw na Wroniej Górce")
                .areaColor("green")
                .description("Plac zabaw")
                .comments(new ArrayList<>())
                .rating(4.8)
                .viewsCount(100)
                .images(new ArrayList<>())
                .build();

        Spot spot8 = Spot.builder()
                .name("Plaża stogi")
                .areaColor("green")
                .description("Szeroka piaszczysta plaża.")
                .comments(new ArrayList<>())
                .rating(4.6)
                .viewsCount(100)
                .images(new ArrayList<>())
                .build();

        Spot spot9 = Spot.builder()
                .name("Park Oruński im. Emilii Hoene")
                .areaColor("green")
                .description("Park Oruński należy, obok Parku Oliwskiego, należy do najcenniejszych zachowanych dawnych gdańskich parków.")
                .comments(new ArrayList<>())
                .rating(5.0)
                .viewsCount(100)
                .images(new ArrayList<>())
                .build();

        Spot spot10 = Spot.builder()
                .name("Park Street Workout")
                .areaColor("green")
                .description("Park, który oryginalnie był cmentarzem protestanckim, należącym dawniej do kościoła przy placu Oruńskim.")
                .comments(new ArrayList<>())
                .rating(4.4)
                .viewsCount(7)
                .images(new ArrayList<>())
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

        List<Comment> commentList1 = new ArrayList<>(asList(
                Comment.builder()
                        .text("Świetne miejsce, warto odwiedzić!")
                        .rating(5.0)
                        .spot(spot1)
                        .publishDate(LocalDateTime.of(2024, 6, 1, 10, 15))
                        .author(user)
                        .build(),
                Comment.builder()
                        .text("Było fajnie, choć spodziewałem się więcej.")
                        .rating(4.0)
                        .spot(spot1)
                        .publishDate(LocalDateTime.of(2024, 6, 2, 14, 30))
                        .author(user)
                        .build()
        ));

        List<Comment> commentList2 = asList(
                Comment.builder()
                        .text("Idealne miejsce na relaks.")
                        .rating(5.0)
                        .spot(spot2)
                        .publishDate(LocalDateTime.of(2024, 6, 3, 9, 45))
                        .author(user)
                        .build(),
                Comment.builder()
                        .text("Widoki niezłe, ale tłoczno i głośno.")
                        .rating(3.0)
                        .spot(spot2)
                        .publishDate(LocalDateTime.of(2024, 6, 4, 16, 20))
                        .author(user)
                        .build()
        );

        List<Comment> commentList3 = asList(
                Comment.builder()
                        .text("Czysto, spokojnie i klimatycznie.")
                        .rating(5.0)
                        .spot(spot3)
                        .publishDate(LocalDateTime.of(2024, 6, 5, 8, 10))
                        .author(user)
                        .build(),
                Comment.builder()
                        .text("Trochę zbyt mało atrakcji jak dla mnie.")
                        .rating(3.5)
                        .spot(spot3)
                        .publishDate(LocalDateTime.of(2024, 6, 6, 18, 55))
                        .author(user)
                        .build()
        );

        List<Comment> commentList4 = asList(
                Comment.builder()
                        .text("Miejsce warte odwiedzenia, polecam.")
                        .rating(4.5)
                        .spot(spot4)
                        .publishDate(LocalDateTime.of(2024, 6, 7, 11, 40))
                        .author(user)
                        .build(),
                Comment.builder()
                        .text("Atmosfera w porządku, ale spodziewałem się więcej zieleni.")
                        .rating(3.0)
                        .spot(spot4)
                        .publishDate(LocalDateTime.of(2024, 6, 8, 13, 25))
                        .author(user)
                        .build()
        );

        List<Comment> commentList5 = asList(
                Comment.builder()
                        .text("Rewelacyjne miejsce na wycieczkę!")
                        .rating(5.0)
                        .spot(spot5)
                        .publishDate(LocalDateTime.of(2024, 6, 9, 7, 50))
                        .author(user)
                        .build(),
                Comment.builder()
                        .text("Dobre miejsce, ale trochę za drogo jak na jakość.")
                        .rating(4.0)
                        .spot(spot5)
                        .publishDate(LocalDateTime.of(2024, 6, 10, 20, 15))
                        .author(user)
                        .build()
        );

        List<Comment> commentList6 = asList(
                Comment.builder()
                        .text("Wspaniałe widoki, aż chce się wracać.")
                        .rating(5.0)
                        .spot(spot6)
                        .publishDate(LocalDateTime.of(2024, 6, 11, 15, 30))
                        .author(user)
                        .build(),
                Comment.builder()
                        .text("Było przyjemnie, choć obsługa mogłaby być milsza.")
                        .rating(4.0)
                        .spot(spot6)
                        .publishDate(LocalDateTime.of(2024, 6, 12, 19, 5))
                        .author(user)
                        .build()
        );

        List<Comment> commentList7 = asList(
                Comment.builder()
                        .text("Bardzo ciekawe miejsce z historią.")
                        .rating(5.0)
                        .spot(spot7)
                        .publishDate(LocalDateTime.of(2024, 6, 13, 12, 10))
                        .author(user)
                        .build(),
                Comment.builder()
                        .text("Miejsce okej, ale parking był problematyczny.")
                        .rating(3.5)
                        .spot(spot7)
                        .publishDate(LocalDateTime.of(2024, 6, 14, 14, 50))
                        .author(user)
                        .build()
        );

        List<Comment> commentList8 = asList(
                Comment.builder()
                        .text("Czyste i dobrze zorganizowane miejsce.")
                        .rating(4.5)
                        .spot(spot8)
                        .publishDate(LocalDateTime.of(2024, 6, 15, 9, 0))
                        .author(user)
                        .build(),
                Comment.builder()
                        .text("Naprawdę wyjątkowe miejsce, choć trochę za dużo ludzi.")
                        .rating(4.0)
                        .spot(spot8)
                        .publishDate(LocalDateTime.of(2024, 6, 16, 18, 45))
                        .author(user)
                        .build()
        );

        List<Comment> commentList9 = asList(
                Comment.builder()
                        .text("Super miejsce na rodzinny wypad.")
                        .rating(5.0)
                        .spot(spot9)
                        .publishDate(LocalDateTime.of(2024, 6, 17, 8, 30))
                        .author(user)
                        .build(),
                Comment.builder()
                        .text("Nie najgorsze, ale brakowało mi większych atrakcji.")
                        .rating(3.5)
                        .spot(spot9)
                        .publishDate(LocalDateTime.of(2024, 6, 18, 21, 10))
                        .author(user)
                        .build()
        );

        List<Comment> commentList10 = asList(
                Comment.builder()
                        .text("Miejsce godne polecenia, świetna organizacja.")
                        .rating(5.0)
                        .spot(spot10)
                        .publishDate(LocalDateTime.of(2024, 6, 19, 10, 20))
                        .author(user)
                        .build(),
                Comment.builder()
                        .text("Podobało mi się, choć były drobne niedociągnięcia.")
                        .rating(4.5)
                        .spot(spot10)
                        .publishDate(LocalDateTime.of(2024, 6, 20, 17, 35))
                        .author(user)
                        .build()
        );

        for (int i = 0; i < 100; i++) {
            Comment comment = Comment.builder()
                    .text("Comment" + i + ": Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
                    .rating((i + 1.0) % 5.0)
                    .spot(spot1)
                    .publishDate(LocalDateTime.now())
                    .author(user)
                    .build();
            commentList1.add(comment);
        }

        List<Img> gallery1 = Arrays.asList(
                new Img(null, "https://lh3.googleusercontent.com/d/1J4_BtivXgNKGf4dFpvxjdxXfllW1HTcr", "pomnik", "pomnik", 0, 0, user, spot1),
                new Img(null, "https://lh3.googleusercontent.com/d/1xyS6gNVeTgKBCs5uctu3ISwzOJ7CRZUC", "pomnik", "pomnik", 0, 0, user, spot1),
                new Img(null, "https://lh3.googleusercontent.com/d/1g10-_SsUwVlB2rD-cu89X0XLAa4xZY29", "pomnik", "pomnik", 0, 0, user, spot1)
        );

        List<Img> gallery2 = Arrays.asList(
                new Img(null, "https://lh3.googleusercontent.com/d/1vjqnIOG93OtFfIcq9xcvSMXV1Yxe_aln", "skwer", "skwer", 0, 0, user, spot2),
                new Img(null, "https://lh3.googleusercontent.com/d/1XMsLfEF65LMlqitRTWlsee9yI4ncXv8H", "skwer", "skwer", 0, 0, user, spot2),
                new Img(null, "https://lh3.googleusercontent.com/d/1MjD6IwvVz-Z0O16cwZwY_L_FNFbPbTO1", "skwer", "skwer", 0, 0, user, spot2)
        );

        List<Img> gallery3 = Arrays.asList(
                new Img(null, "https://lh3.googleusercontent.com/d/1DgIH0iKDgbnvAV7cEpHPrSIffrt4umvl", "park wałowy", "park wałowy", 0, 0, user, spot3),
                new Img(null, "https://lh3.googleusercontent.com/d/1wkG_4lPPY300NdBA3O8mmC5zN56ZsVXh", "park wałowy", "park wałowy", 0, 0, user, spot3),
                new Img(null, "https://lh3.googleusercontent.com/d/12Nv4RC3jqB7K-_D2vSZBwJ0a4WF41JN5", "park wałowy", "park wałowy", 0, 0, user, spot3)
        );

        List<Img> gallery4 = Arrays.asList(
                new Img(null, "https://lh3.googleusercontent.com/d/14f_jGNXnNJLNo0hJaiDE0G5kugud3TIg", "park", "park", 0, 0, user, spot4),
                new Img(null, "https://lh3.googleusercontent.com/d/1Zd-b4kyj7LJieg85PteTiIBCjKBnQGK9", "park", "park", 0, 0, user, spot4),
                new Img(null, "https://lh3.googleusercontent.com/d/1iJvpHSBHxERkgr2rOA3W6tofn331FTfX", "park", "park", 0, 0, user, spot4)
        );

        List<Img> gallery5 = Arrays.asList(
                new Img(null, "https://lh3.googleusercontent.com/d/1SvakIJR_FeXt4ySPwCM5PIiMi_D00AP0", "jar", "jar", 0, 0, user, spot5),
                new Img(null, "https://lh3.googleusercontent.com/d/1jOI-9e4CjttjImKcgEP30eBkEeAzI-SP", "jar", "jar", 0, 0, user, spot5),
                new Img(null, "https://lh3.googleusercontent.com/d/16127OXRWoQp7-q7ToKewFjjtIxFNl4s4", "jar", "jar", 0, 0, user, spot5)
        );

        List<Img> gallery6 = Arrays.asList(
                new Img(null, "https://lh3.googleusercontent.com/d/1TsbUFw4OISEa-jHXeuO6PyFpsP3H-2i5", "plac kobzdeja", "plac kobzdeja", 0, 0, user, spot6),
                new Img(null, "https://lh3.googleusercontent.com/d/1GTQ04HD147i934PheVwA56NjL2zDuRIa", "plac kobzdeja", "plac kobzdeja", 0, 0, user, spot6),
                new Img(null, "https://lh3.googleusercontent.com/d/1pmN2Pw3xEyyGTakf835CCzTqRtMPuwN2", "plac kobzdeja", "plac kobzdeja", 0, 0, user, spot6)
        );

        List<Img> gallery7 = Arrays.asList(
                new Img(null, "https://lh3.googleusercontent.com/d/1-HJnw3DYEF_uG6Ns10gBNPkCbg_s4ZZV", "wrona", "wrona", 0, 0, user, spot7),
                new Img(null, "https://lh3.googleusercontent.com/d/18zoDX1ETDIEsKDZzZpD8I79wsZAsw1Mi", "wrona", "wrona", 0, 0, user, spot7),
                new Img(null, "https://lh3.googleusercontent.com/d/1k9VAhDzRrnIAM2BbKERttwW2aMG4Cis4", "wrona", "wrona", 0, 0, user, spot7)
        );

        List<Img> gallery8 = Arrays.asList(
                new Img(null, "https://lh3.googleusercontent.com/d/1ZHZle8PmbNyTCkbgOnwSAjrQAnYmR80G", "plaża", "plaża", 0, 0, user, spot8),
                new Img(null, "https://lh3.googleusercontent.com/d/1LUlzuddI8pd-ptF6viMn2Xzl4qh4sUTr", "plaża", "plaża", 0, 0, user, spot8),
                new Img(null, "https://lh3.googleusercontent.com/d/15jWJ8Fmt7jXZNlLh3klPhzcHe995zkbL", "plaża", "plaża", 0, 0, user, spot8)
        );

        List<Img> gallery9 = Arrays.asList(
                new Img(null, "https://lh3.googleusercontent.com/d/1SR-ft17f_8j0bjn_7I3EAjTUCPTiW3nP", "orunia", "orunia", 0, 0, user, spot9),
                new Img(null, "https://lh3.googleusercontent.com/d/1NEalkqOXoRrVNswZGo1ftb9KczI8BNde", "orunia", "orunia", 0, 0, user, spot9),
                new Img(null, "https://lh3.googleusercontent.com/d/1-AbYbbjZj_yTQJpNpLSOWcbXap_JO-3n", "orunia", "orunia", 0, 0, user, spot9)
        );

        List<Img> gallery10 = Arrays.asList(
                new Img(null, "https://lh3.googleusercontent.com/d/1jKIQK6u2zcdsydVL-zC601-dOSL752nv", "workout", "workout", 0, 0, user, spot10),
                new Img(null, "https://lh3.googleusercontent.com/d/1HjmEcx-9Fk5pg16IcrLUs9cK6S0-0Ufq", "workout", "workout", 0, 0, user, spot10)
        );


        List<Spot> spots = List.of(spot1, spot2, spot3, spot4, spot5, spot6, spot7, spot8, spot9, spot10);
        var contours = List.of(contour1, contour2, contour3, contour4, contour5, contour6, contour7, contour8, contour9, contour10);
        List<List<Comment>> commentLists = List.of(commentList1, commentList2, commentList3, commentList4, commentList5, commentList6, commentList7, commentList8, commentList9, commentList10);
        List<List<Img>> galleries = List.of(gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, gallery7, gallery8, gallery9, gallery10);

        for (int i = 0; i < spots.size(); i++) {
            Spot spot = spots.get(i);
            spot.getBorderPoints().addAll(contours.get(i));
            spot.getComments().addAll(commentLists.get(i));
            spot.getImages().addAll(galleries.get(i));

            var comments = commentLists.get(i);
            var rating = comments.stream()
                    .mapToDouble(Comment::getRating)
                    .average()
                    .orElse(0.0);
            spot.setRating(BigDecimal.valueOf(rating).setScale(2, RoundingMode.HALF_UP).doubleValue());
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
