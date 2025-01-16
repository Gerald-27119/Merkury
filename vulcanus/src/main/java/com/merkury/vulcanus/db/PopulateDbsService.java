package com.merkury.vulcanus;

import com.merkury.vulcanus.model.entities.*;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static com.merkury.vulcanus.model.enums.UserRole.ROLE_ADMIN;
import static com.merkury.vulcanus.model.enums.UserRole.ROLE_USER;
import static java.util.Arrays.asList;

@Slf4j
@Service
@RequiredArgsConstructor
public class PopulateDbsService {

    private final PasswordEncoder passwordEncoder;
    private final UserEntityRepository userEntityRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final SpotRepository spotRepository;
    private final CommentRepository commentRepository;
    private final ImgRepository imgRepository;

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

        log.info("Users from db:");
        userEntityRepository.findAll().forEach(userEntity ->
                log.info(userEntity.toString()));

        PasswordResetToken token = new PasswordResetToken(
                UUID.fromString("fff3a3f6-fbd8-4fc5-890c-626343f2f324"),
                LocalDateTime.now().plusMinutes(15),
                user.getEmail());

        passwordResetTokenRepository.save(token);

        Spot spot1 = Spot.builder()
                .name("Pomnik konny Jana III Sobieskiego")
                .areaColor("green")
                .description("Brązowy posąg XVII-wiecznego polskiego króla Jana III Sobieskiego na koniu usytuowany na małym placu.")
                .borderPoints(new ArrayList<>())
                .comments(new ArrayList<>())
                .rating(5.0)
                .viewsCount(100)
                .images(new ArrayList<>())
                .build();

        Spot spot2 = Spot.builder()
                .name("Skwer Czesława Niemena")
                .areaColor("green")
                .description("Mały park z ławkami i pomnikiem Czesława Niemena.")
                .borderPoints(new ArrayList<>())
                .comments(new ArrayList<>())
                .rating(5.0)
                .viewsCount(100)
                .images(new ArrayList<>())
                .build();

        Spot spot3 = Spot.builder()
                .name("Park Wałowy")
                .areaColor("green")
                .description("Mały park z ławkami")
                .borderPoints(new ArrayList<>())
                .comments(new ArrayList<>())
                .rating(3.5)
                .viewsCount(10)
                .images(new ArrayList<>())
                .build();

        Spot spot4 = Spot.builder()
                .name("Park")
                .areaColor("green")
                .description("Mały park")
                .borderPoints(new ArrayList<>())
                .comments(new ArrayList<>())
                .rating(3.6)
                .viewsCount(17)
                .images(new ArrayList<>())
                .build();

        Spot spot5 = Spot.builder()
                .name("Jar Wilanowski")
                .areaColor("green")
                .description("Zielona strefa z jeziorem")
                .borderPoints(new ArrayList<>())
                .comments(new ArrayList<>())
                .rating(4.6)
                .viewsCount(120)
                .images(new ArrayList<>())
                .build();

        Spot spot6 = Spot.builder()
                .name("Plac imienia Dariusza Kobzdeja")
                .areaColor("green")
                .description("Mały, zadbany plac z ławeczkami i zielenią. Znajduje się on z jednej strony w pobliżu pomnika Jana III Sobieskiego, a z drugiej strony w pobliżu Hali Targowej.")
                .borderPoints(new ArrayList<>())
                .comments(new ArrayList<>())
                .rating(4.5)
                .viewsCount(500)
                .images(new ArrayList<>())
                .build();

        Spot spot7 = Spot.builder()
                .name("Plac Zabaw na Wroniej Górce")
                .areaColor("green")
                .description("Plac zabaw")
                .borderPoints(new ArrayList<>())
                .comments(new ArrayList<>())
                .rating(4.8)
                .viewsCount(100)
                .images(new ArrayList<>())
                .build();

        Spot spot8 = Spot.builder()
                .name("Plaża stogi")
                .areaColor("green")
                .description("Szeroka piaszczysta plaża.")
                .borderPoints(new ArrayList<>())
                .comments(new ArrayList<>())
                .rating(4.6)
                .viewsCount(100)
                .images(new ArrayList<>())
                .build();

        Spot spot9 = Spot.builder()
                .name("Park Oruński im. Emilii Hoene")
                .areaColor("green")
                .description("Park Oruński należy, obok Parku Oliwskiego, należy do najcenniejszych zachowanych dawnych gdańskich parków.")
                .borderPoints(new ArrayList<>())
                .comments(new ArrayList<>())
                .rating(5.0)
                .viewsCount(100)
                .images(new ArrayList<>())
                .build();

        Spot spot10 = Spot.builder()
                .name("Park Street Workout")
                .areaColor("green")
                .description("Park, który oryginalnie był cmentarzem protestanckim, należącym dawniej do kościoła przy placu Oruńskim.")
                .borderPoints(new ArrayList<>())
                .comments(new ArrayList<>())
                .rating(4.4)
                .viewsCount(7)
                .images(new ArrayList<>())
                .build();

        spotRepository.saveAll(List.of(spot1, spot2, spot3, spot4, spot5, spot6, spot7, spot8, spot9, spot10));

        List<Point> contour1 = asList(
                new Point(54.352223, 18.647865, spot1),
                new Point(54.352293, 18.648729, spot1),
                new Point(54.35217, 18.64886, spot1),
                new Point(54.351863, 18.648476, spot1),
                new Point(54.352127, 18.647795, spot1),
                new Point(54.352223, 18.647865, spot1)
        );

        List<Point> contour2 = asList(
                new Point(54.352541, 18.643992, spot2),
                new Point(54.35239, 18.64477, spot2),
                new Point(54.352299, 18.644891, spot2),
                new Point(54.352197, 18.645478, spot2),
                new Point(54.35207, 18.645385, spot2),
                new Point(54.352022, 18.643854, spot2),
                new Point(54.35215, 18.643724, spot2),
                new Point(54.352541, 18.643992, spot2)
        );

        List<Point> contour3 = asList(
                new Point(54.34259835347914, 18.646824493647234, spot3),
                new Point(54.34199917555038, 18.64785810853534, spot3),
                new Point(54.34195539522013, 18.647858779087542, spot3),
                new Point(54.34137469972922, 18.647210032866408, spot3),
                new Point(54.341541692733195, 18.646703124929658, spot3),
                new Point(54.341637055513615, 18.646738079025297, spot3),
                new Point(54.3419363403778, 18.646826492025596, spot3),
                new Point(54.342225666534006, 18.64683452957797, spot3),
                new Point(54.342545681638356, 18.646805949945094, spot3),
                new Point(54.34259835347914, 18.646824493647234, spot3)
        );

        List<Point> contour4 = asList(
                new Point(54.35165940763592, 18.648793774997493, spot4),
                new Point(54.351680293212745, 18.648745327233843, spot4),
                new Point(54.35183253332448, 18.648952025317534, spot4),
                new Point(54.35200919291976, 18.649438999131455, spot4),
                new Point(54.35199829573896, 18.649543918905415, spot4),
                new Point(54.35190059549554, 18.65002604593978, spot4),
                new Point(54.3514576317341, 18.649347464307972, spot4),
                new Point(54.351482643288136, 18.6492770563266, spot4),
                new Point(54.35164951686307, 18.649484927516383, spot4),
                new Point(54.35181742720021, 18.649007936786656, spot4),
                new Point(54.35165940763592, 18.648793774997493, spot4)
        );

        List<Point> contour5 = asList(
                new Point(54.33273052789799, 18.607928515378298, spot5),
                new Point(54.332883674817786, 18.602005681784895, spot5),
                new Point(54.33347676722585, 18.602138197080475, spot5),
                new Point(54.334165967969106, 18.604189842724054, spot5),
                new Point(54.33586429814381, 18.603372776749126, spot5),
                new Point(54.334469166558435, 18.60516083775306, spot5),
                new Point(54.33440784100703, 18.60914014998731, spot5),
                new Point(54.33273052789799, 18.607928515378298, spot5)
        );

        List<Point> contour6 = asList(
                new Point(54.35200732546214, 18.65021445366572, spot6),
                new Point(54.35220301624161, 18.649300832037643, spot6),
                new Point(54.35241008337719, 18.6493203538673, spot6),
                new Point(54.35301535055999, 18.650940665729063, spot6),
                new Point(54.35291068093288, 18.65109684036634, spot6),
                new Point(54.35275140055396, 18.651112457830067, spot6),
                new Point(54.35200960094167, 18.650202740567924, spot6),
                new Point(54.35200732546214, 18.65021445366572, spot6)
        );

        List<Point> contour7 = asList(
                new Point(54.358542876913596, 18.63203900299652, spot7),
                new Point(54.35822244612602, 18.630237221776515, spot7),
                new Point(54.35864173271596, 18.630079273422812, spot7),
                new Point(54.35918032221919, 18.629266131898195, spot7),
                new Point(54.359275767723744, 18.63173480616717, spot7),
                new Point(54.358542876913596, 18.63203900299652, spot7)
        );

        List<Point> contour8 = asList(
                new Point(54.38058274498329, 18.71852472241705, spot8),
                new Point(54.374571558766014, 18.734291452494816, spot8),
                new Point(54.374154434956594, 18.73390498116206, spot8),
                new Point(54.37588475304012, 18.726626367217193, spot8),
                new Point(54.37737805637779, 18.72191952735178, spot8),
                new Point(54.379948555376366, 18.717845650954484, spot8),
                new Point(54.38058274498329, 18.71852472241705, spot8)
        );

        List<Point> contour9 = asList(
                new Point(54.3230684167437, 18.629913718953556, spot9),
                new Point(54.32202382781201, 18.629940753924505, spot9),
                new Point(54.321889803154754, 18.629704197939827, spot9),
                new Point(54.32202382780555, 18.628724180242937, spot9),
                new Point(54.321909512689615, 18.628399760591552, spot9),
                new Point(54.32186220979011, 18.627473812836563, spot9),
                new Point(54.32089248834232, 18.62753464135538, spot9),
                new Point(54.3208727783163, 18.622553447736156, spot9),
                new Point(54.323001406164785, 18.62577736810166, spot9),
                new Point(54.3230684167437, 18.629913718953556, spot9)
        );

        List<Point> contour10 = asList(
                new Point(54.32202428469449, 18.63395637969597, spot10),
                new Point(54.321451089176406, 18.633757481769084, spot10),
                new Point(54.321451089176406, 18.635939509025782, spot10),
                new Point(54.3218434560184, 18.635892709513577, spot10),
                new Point(54.32184686788757, 18.63498011902552, spot10),
                new Point(54.322051004640734, 18.634962421442747, spot10),
                new Point(54.32203140614784, 18.633959822968333, spot10),
                new Point(54.32202428469449, 18.63395637969597, spot10)
        );

        List<Comment> commentList1 = new ArrayList<>(asList(
                new Comment(null, "Świetne miejsce, warto odwiedzić!", 5.0, 0, spot1, LocalDateTime.of(2024, 6, 1, 10, 15), user),
                new Comment(null, "Było fajnie, choć spodziewałem się więcej.", 4.0, 0, spot1, LocalDateTime.of(2024, 6, 2, 14, 30), user)
        ));

        List<Comment> commentList2 = asList(
                new Comment(null, "Idealne miejsce na relaks.", 5.0, 0, spot2, LocalDateTime.of(2024, 6, 3, 9, 45), user),
                new Comment(null, "Widoki niezłe, ale tłoczno i głośno.", 3.0, 0, spot2, LocalDateTime.of(2024, 6, 4, 16, 20), user)
        );

        List<Comment> commentList3 = asList(
                new Comment(null, "Czysto, spokojnie i klimatycznie.", 5.0, 0, spot3, LocalDateTime.of(2024, 6, 5, 8, 10), user),
                new Comment(null, "Trochę zbyt mało atrakcji jak dla mnie.", 3.5, 0, spot3, LocalDateTime.of(2024, 6, 6, 18, 55), user)
        );

        List<Comment> commentList4 = asList(
                new Comment(null, "Miejsce warte odwiedzenia, polecam.", 4.5, 0, spot4, LocalDateTime.of(2024, 6, 7, 11, 40), user),
                new Comment(null, "Atmosfera w porządku, ale spodziewałem się więcej zieleni.", 3.0, 0, spot4, LocalDateTime.of(2024, 6, 8, 13, 25), user)
        );

        List<Comment> commentList5 = asList(
                new Comment(null, "Rewelacyjne miejsce na wycieczkę!", 5.0, 0, spot5, LocalDateTime.of(2024, 6, 9, 7, 50), user),
                new Comment(null, "Dobre miejsce, ale trochę za drogo jak na jakość.", 4.0, 0, spot5, LocalDateTime.of(2024, 6, 10, 20, 15), user)
        );

        List<Comment> commentList6 = asList(
                new Comment(null, "Wspaniałe widoki, aż chce się wracać.", 5.0, 0, spot6, LocalDateTime.of(2024, 6, 11, 15, 30), user),
                new Comment(null, "Było przyjemnie, choć obsługa mogłaby być milsza.", 4.0, 0, spot6, LocalDateTime.of(2024, 6, 12, 19, 5), user)
        );

        List<Comment> commentList7 = asList(
                new Comment(null, "Bardzo ciekawe miejsce z historią.", 5.0, 0, spot7, LocalDateTime.of(2024, 6, 13, 12, 10), user),
                new Comment(null, "Miejsce okej, ale parking był problematyczny.", 3.5, 0, spot7, LocalDateTime.of(2024, 6, 14, 14, 50), user)
        );

        List<Comment> commentList8 = asList(
                new Comment(null, "Czyste i dobrze zorganizowane miejsce.", 4.5, 0, spot8, LocalDateTime.of(2024, 6, 15, 9, 0), user),
                new Comment(null, "Naprawdę wyjątkowe miejsce, choć trochę za dużo ludzi.", 4.0, 0, spot8, LocalDateTime.of(2024, 6, 16, 18, 45), user)
        );

        List<Comment> commentList9 = asList(
                new Comment(null, "Super miejsce na rodzinny wypad.", 5.0, 0, spot9, LocalDateTime.of(2024, 6, 17, 8, 30), user),
                new Comment(null, "Nie najgorsze, ale brakowało mi większych atrakcji.", 3.5, 0, spot9, LocalDateTime.of(2024, 6, 18, 21, 10), user)
        );

        List<Comment> commentList10 = asList(
                new Comment(null, "Miejsce godne polecenia, świetna organizacja.", 5.0, 0, spot10, LocalDateTime.of(2024, 6, 19, 10, 20), user),
                new Comment(null, "Podobało mi się, choć były drobne niedociągnięcia.", 4.5, 0, spot10, LocalDateTime.of(2024, 6, 20, 17, 35), user)
        );

        for(int i = 0; i <100; i++){
            Comment comment = Comment.builder()
                    .text("Comment"+i+": Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
                    .rating((i+1.0)%5.0)
                    .likes(1)
                    .spot(spot1)
                    .publishDate(LocalDateTime.now())
                    .author(user)
                    .build();
            System.out.print(commentList1);
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
        List<List<Point>> contours = List.of(contour1, contour2, contour3, contour4, contour5, contour6, contour7, contour8, contour9, contour10);
        List<List<Comment>> commentLists = List.of(commentList1, commentList2, commentList3, commentList4, commentList5, commentList6, commentList7, commentList8, commentList9, commentList10);
        List<List<Img>> galleries = List.of(gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, gallery7, gallery8, gallery9, gallery10);

        for (int i = 0; i < spots.size(); i++) {
            Spot spot = spots.get(i);
            spot.getBorderPoints().addAll(contours.get(i));
            spot.getComments().addAll(commentLists.get(i));
            spot.getImages().addAll(galleries.get(i));
        }

        spotRepository.saveAll(spots);
    }

}
