package com.merkury.vulcanus;

import com.merkury.vulcanus.model.entities.Comment;
import com.merkury.vulcanus.model.entities.PasswordResetToken;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.repositories.CommentRepository;
import com.merkury.vulcanus.model.repositories.PasswordResetTokenRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.UUID;

import static com.merkury.vulcanus.model.enums.UserRole.ROLE_ADMIN;
import static com.merkury.vulcanus.model.enums.UserRole.ROLE_USER;

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

        for(int i = 0; i <10; i++){
            UserEntity locustUser = UserEntity.builder()
                    .email("user"+i+"@example.com")
                    .username("user"+i)
                    .password(passwordEncoder.encode("password"))
                    .userRole(ROLE_USER)
                    .provider(Provider.NONE)
                    .build();

            userEntityRepository.save(locustUser);
        }

        userEntityRepository.save(admin);
        userEntityRepository.save(user);

        for(int i = 0; i <100; i++){
            Comment comment = Comment.builder()
                    .text("Comment"+i+": Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
                    .rating(5.0%i+1.0)
                    .publishDate(LocalDate.now())
                    .author(user)
                    .spot(null)
                    .build();

            commentRepository.save(comment);
        }

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

        List<Point> contour1 = Arrays.asList(
                new Point(54.352223, 18.647865, spot1),
                new Point(54.352293, 18.648729, spot1),
                new Point(54.35217, 18.64886, spot1),
                new Point(54.351863, 18.648476, spot1),
                new Point(54.352127, 18.647795, spot1),
                new Point(54.352223, 18.647865, spot1)
        );

        List<Point> contour2 = Arrays.asList(
                new Point(54.352541, 18.643992, spot2),
                new Point(54.35239, 18.64477, spot2),
                new Point(54.352299, 18.644891, spot2),
                new Point(54.352197, 18.645478, spot2),
                new Point(54.35207, 18.645385, spot2),
                new Point(54.352022, 18.643854, spot2),
                new Point(54.35215, 18.643724, spot2),
                new Point(54.352541, 18.643992, spot2)
        );

        List<Point> contour3 = Arrays.asList(
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

        List<Point> contour4 = Arrays.asList(
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

        List<Point> contour5 = Arrays.asList(
                new Point(54.33273052789799, 18.607928515378298, spot5),
                new Point(54.332883674817786, 18.602005681784895, spot5),
                new Point(54.33347676722585, 18.602138197080475, spot5),
                new Point(54.334165967969106, 18.604189842724054, spot5),
                new Point(54.33586429814381, 18.603372776749126, spot5),
                new Point(54.334469166558435, 18.60516083775306, spot5),
                new Point(54.33440784100703, 18.60914014998731, spot5),
                new Point(54.33273052789799, 18.607928515378298, spot5)
        );

        List<Point> contour6 = Arrays.asList(
                new Point(54.35200732546214, 18.65021445366572, spot6),
                new Point(54.35220301624161, 18.649300832037643, spot6),
                new Point(54.35241008337719, 18.6493203538673, spot6),
                new Point(54.35301535055999, 18.650940665729063, spot6),
                new Point(54.35291068093288, 18.65109684036634, spot6),
                new Point(54.35275140055396, 18.651112457830067, spot6),
                new Point(54.35200960094167, 18.650202740567924, spot6),
                new Point(54.35200732546214, 18.65021445366572, spot6)
        );

        List<Point> contour7 = Arrays.asList(
                new Point(54.358542876913596, 18.63203900299652, spot7),
                new Point(54.35822244612602, 18.630237221776515, spot7),
                new Point(54.35864173271596, 18.630079273422812, spot7),
                new Point(54.35918032221919, 18.629266131898195, spot7),
                new Point(54.359275767723744, 18.63173480616717, spot7),
                new Point(54.358542876913596, 18.63203900299652, spot7)
        );

        List<Point> contour8 = Arrays.asList(
                new Point(54.38058274498329, 18.71852472241705, spot8),
                new Point(54.374571558766014, 18.734291452494816, spot8),
                new Point(54.374154434956594, 18.73390498116206, spot8),
                new Point(54.37588475304012, 18.726626367217193, spot8),
                new Point(54.37737805637779, 18.72191952735178, spot8),
                new Point(54.379948555376366, 18.717845650954484, spot8),
                new Point(54.38058274498329, 18.71852472241705, spot8)
        );

        List<Point> contour9 = Arrays.asList(
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

        List<Point> contour10 = Arrays.asList(
                new Point(54.32202428469449, 18.63395637969597, spot10),
                new Point(54.321451089176406, 18.633757481769084, spot10),
                new Point(54.321451089176406, 18.635939509025782, spot10),
                new Point(54.3218434560184, 18.635892709513577, spot10),
                new Point(54.32184686788757, 18.63498011902552, spot10),
                new Point(54.322051004640734, 18.634962421442747, spot10),
                new Point(54.32203140614784, 18.633959822968333, spot10),
                new Point(54.32202428469449, 18.63395637969597, spot10)
        );

        List<Comment> commentList1 = Arrays.asList(
                new Comment("Świetne miejsce, warto odwiedzić!", 5.0, 0, spot1, LocalDate.of(2024, 6, 1), user),
                new Comment("Było fajnie, choć spodziewałem się więcej.", 4.0, 0, spot1, LocalDate.of(2024, 6, 2), user)
        );

        List<Comment> commentList2 = Arrays.asList(
                new Comment("Idealne miejsce na relaks.", 5.0, 0, spot2, LocalDate.of(2024, 6, 3), user),
                new Comment("Widoki niezłe, ale tłoczno i głośno.", 3.0, 0, spot2, LocalDate.of(2024, 6, 4), user)
        );

        List<Comment> commentList3 = Arrays.asList(
                new Comment("Czysto, spokojnie i klimatycznie.", 5.0, 0, spot3, LocalDate.of(2024, 6, 5), user),
                new Comment("Trochę zbyt mało atrakcji jak dla mnie.", 3.5, 0, spot3, LocalDate.of(2024, 6, 6), user)
        );

        List<Comment> commentList4 = Arrays.asList(
                new Comment("Miejsce warte odwiedzenia, polecam.", 4.5, 0, spot4, LocalDate.of(2024, 6, 7), user),
                new Comment("Atmosfera w porządku, ale spodziewałem się więcej zieleni.", 3.0, 0, spot4, LocalDate.of(2024, 6, 8), user)
        );

        List<Comment> commentList5 = Arrays.asList(
                new Comment("Rewelacyjne miejsce na wycieczkę!", 5.0, 0, spot5, LocalDate.of(2024, 6, 9), user),
                new Comment("Dobre miejsce, ale trochę za drogo jak na jakość.", 4.0, 0, spot5, LocalDate.of(2024, 6, 10), user)
        );

        List<Comment> commentList6 = Arrays.asList(
                new Comment("Wspaniałe widoki, aż chce się wracać.", 5.0, 0, spot6, LocalDate.of(2024, 6, 11), user),
                new Comment("Było przyjemnie, choć obsługa mogłaby być milsza.", 4.0, 0, spot6, LocalDate.of(2024, 6, 12), user)
        );

        List<Comment> commentList7 = Arrays.asList(
                new Comment("Bardzo ciekawe miejsce z historią.", 5.0, 0, spot7, LocalDate.of(2024, 6, 13), user),
                new Comment("Miejsce okej, ale parking był problematyczny.", 3.5, 0, spot7, LocalDate.of(2024, 6, 14), user)
        );

        List<Comment> commentList8 = Arrays.asList(
                new Comment("Czyste i dobrze zorganizowane miejsce.", 4.5, 0, spot8, LocalDate.of(2024, 6, 15), user),
                new Comment("Naprawdę wyjątkowe miejsce, choć trochę za dużo ludzi.", 4.0, 0, spot8, LocalDate.of(2024, 6, 16), user)
        );

        List<Comment> commentList9 = Arrays.asList(
                new Comment("Super miejsce na rodzinny wypad.", 5.0, 0, spot9, LocalDate.of(2024, 6, 17), user),
                new Comment("Nie najgorsze, ale brakowało mi większych atrakcji.", 3.5, 0, spot9, LocalDate.of(2024, 6, 18), user)
        );

        List<Comment> commentList10 = Arrays.asList(
                new Comment("Miejsce godne polecenia, świetna organizacja.", 5.0, 0, spot10, LocalDate.of(2024, 6, 19), user),
                new Comment("Podobało mi się, choć były drobne niedociągnięcia.", 4.5, 0, spot10, LocalDate.of(2024, 6, 20), user)
        );


        List<Img> gallery1 = Arrays.asList(
                new Img("https://upload.wikimedia.org/wikipedia/commons/8/8f/John_III_Sobieski_Monument_in_Gda%C5%84sk_2669.JPG", "pomnik", "pomnik", 0, 0, user, spot1),
                new Img("https://gaps.gda.pl/wp-content/uploads/2021/09/SM_065-1-1024x681.jpg", "pomnik", "pomnik", 0, 0, user, spot1),
                new Img("https://i1.nocimg.pl/d6/416/158-gdansk-pomnik-jana-iii-sobieskiego.jpg", "pomnik", "pomnik", 0, 0, user, spot1)
        );

        List<Img> gallery2 = Arrays.asList(
                new Img("https://lh5.googleusercontent.com/p/AF1QipONWLJ_OEhtiG9pHEZbmmBNZiaQuVG82uROLoj9=w408-h306-k-no", "skwer", "skwer", 0, 0, user, spot2),
                new Img("https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Gda%C5%84sk_Skwer_Czes%C5%82awa_Niemena.JPG/2560px-Gda%C5%84sk_Skwer_Czes%C5%82awa_Niemena.JPG", "skwer", "skwer", 0, 0, user, spot2),
                new Img("https://s-trojmiasto.pl/zdj/c/n/9/2986/750x600/2986010-Zielen-na-terenie-skweru-Niemena.webp", "skwer", "skwer", 0, 0, user, spot2)
        );

        List<Img> gallery3 = Arrays.asList(
                new Img("https://s-trojmiasto.pl/zdj/c/n/9/2922/1920x0/2922075-Obecnie-to-nieco-zapomniany-teren-ktory-czeka-na-rewitalizacje.webp", "park wałowy", "park wałowy", 0, 0, user, spot3),
                new Img("https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=gmCXVf6Sftf-V9WiIuwVUg&cb_client=search.gws-prod.gps&w=408&h=240&yaw=232.89917&pitch=0&thumbfov=100", "park wałowy", "park wałowy", 0, 0, user, spot3),
                new Img("https://s-trojmiasto.pl/zdj/c/n/9/2331/1500x0/2331938-Obecnie-plac-Walowy-to-zaniedbane-miejsce.webp", "park wałowy", "park wałowy", 0, 0, user, spot3)
        );

        List<Img> gallery4 = Arrays.asList(
                new Img("https://lh5.googleusercontent.com/p/AF1QipMBnWPy-4MYt0WQbIC8HafWEPN7GwTl6I7XrWdN=w408-h544-k-no", "park", "park", 0, 0, user, spot4),
                new Img("https://lh5.googleusercontent.com/p/AF1QipMT3elr7EwlwKnqxpmGfoQ2lOlYxR213NagDzOK=w408-h725-k-no", "park", "park", 0, 0, user, spot4),
                new Img("https://gdansk.gedanopedia.pl/images/6/63/Pomnik_kwiat.JPG", "park", "park", 0, 0, user, spot4)
        );

        List<Img> gallery5 = Arrays.asList(
                new Img("https://d-art.ppstatic.pl/kadry/k/r/75/0b/59b1497fa1405_o_original.jpg", "jar", "jar", 0, 0, user, spot5),
                new Img("https://s-trojmiasto.pl/zdj/c/n/9/2189/1500x0/2189954-We-wschodniej-czesci-jaru-powstaly-m-in-pola-do-minigolfa-stoly-pingpongowe-oraz-plac-sasiedzki.webp", "jar", "jar", 0, 0, user, spot5),
                new Img("https://foto.cloudgdansk.pl/foto/Jar_Wilanowski_81897_1280px.JPG", "jar", "jar", 0, 0, user, spot5)
        );

        List<Img> gallery6 = Arrays.asList(
                new Img("https://gaps.gda.pl/wp-content/uploads/2021/08/SM_031-1-1024x681.jpg", "plac kobzdeja", "plac kobzdeja", 0, 0, user, spot6),
                new Img("https://upload.wikimedia.org/wikipedia/commons/a/ab/Gdansk-plac_Kobzdeja-obelisk-Herbert.jpg", "plac kobzdeja", "plac kobzdeja", 0, 0, user, spot6),
                new Img("https://upload.wikimedia.org/wikipedia/commons/c/cd/Gda%C5%84sk_plac_Kobzdeja.JPG", "plac kobzdeja", "plac kobzdeja", 0, 0, user, spot6)
        );

        List<Img> gallery7 = Arrays.asList(
                new Img("https://lh5.googleusercontent.com/p/AF1QipPV2HWroKJF1MEQ542bKpmIlLGNj42dNJM2N2w=w408-h306-k-no", "wrona", "wrona", 0, 0, user, spot7),
                new Img("https://files.cloudgdansk.pl/files/objects/thumb/10155_275.jpg", "wrona", "wrona", 0, 0, user, spot7),
                new Img("https://ibedeker.pl/wp-content/gallery/wronia-gorka/img_2006.jpg", "wrona", "wrona", 0, 0, user, spot7)
        );

        List<Img> gallery8 = Arrays.asList(
                new Img("https://lh5.googleusercontent.com/p/AF1QipMF6_xAfFIKoVnLYaW5agOblgtiDZUomDBDUuCt=w408-h306-k-no", "plaża", "plaża", 0, 0, user, spot8),
                new Img("https://stogi.info.pl/wp-content/uploads/2024/02/Kompleksowy_przewodnik_po_plazy_Jelitkowo_atrakcje_historia_i_ciekawostki_2-1080x675.jpg", "plaża", "plaża", 0, 0, user, spot8),
                new Img("https://i.ytimg.com/vi/hs9TdD8TZd4/maxresdefault.jpg", "plaża", "plaża", 0, 0, user, spot8)
        );

        List<Img> gallery9 = Arrays.asList(
                new Img("https://d-art.ppstatic.pl/kadry/k/r/9c/65/5df1faf14a73e_o_large.jpg", "orunia", "orunia", 0, 0, user, spot9),
                new Img("https://lh5.googleusercontent.com/p/AF1QipOL4nY6WdI-icmazsrcesbFB9zkd1WSsgQFSnah=w408-h306-k-no", "orunia", "orunia", 0, 0, user, spot9),
                new Img("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRR-F1umTowNMlCuAQNZwmd6p4Xet-hQg0bQ&s", "orunia", "orunia", 0, 0, user, spot9)
        );

        List<Img> gallery10 = Arrays.asList(
                new Img("https://lh5.googleusercontent.com/p/AF1QipPfl720UMdhBi_3zoXU2qJJ2QJABydhihYSO3WX=w408-h306-k-no", "workout", "workout", 0, 0, user, spot10),
                new Img("https://files.cloudgdansk.pl/files/objects/thumb/10276_275.jpg", "workout", "workout", 0, 0, user, spot10)
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
