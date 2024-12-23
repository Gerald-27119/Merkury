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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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

        spotRepository.saveAll(List.of(spot1, spot2));

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

        Comment comment1 = Comment.builder()
                .text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus, turpis quis porttitor pellentesque, justo erat interdum justo, sit amet rutrum urna nulla quis mi. Nunc interdum dolor a lorem ullamcorper, vel eleifend elit congue.")
                .rating(5.0)
                .likes(0)
                .spot(spot1)
                .author(user)
                .build();

        Comment comment2 = Comment.builder()
                .text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus, turpis quis porttitor pellentesque, justo erat interdum justo, sit amet rutrum urna nulla quis mi. Nunc interdum dolor a lorem ullamcorper, vel eleifend elit congue.")
                .rating(5.0)
                .likes(0)
                .spot(spot2)
                .author(user)
                .build();

        commentRepository.saveAll(List.of(comment1, comment2));

        Img img1 = Img.builder()
                .url("https://cdn.pixabay.com/photo/2023/12/15/22/37/mountains-8451480_640.jpg")
                .alt("image")
                .description("mountains")
                .likes(0)
                .views(0)
                .author(user)
                .spot(spot1)
                .build();

        Img img2 = Img.builder()
                .url("https://cdn.pixabay.com/photo/2023/12/15/22/37/mountains-8451480_640.jpg")
                .alt("image")
                .description("mountains")
                .likes(0)
                .views(0)
                .author(user)
                .spot(spot2)
                .build();

        imgRepository.saveAll(List.of(img1, img2));

        spot1.getBorderPoints().addAll(contour1);
        spot1.getComments().add(comment1);
        spot1.getImages().add(img1);
        spotRepository.save(spot1);

        spot2.getBorderPoints().addAll(contour2);
        spot2.getComments().add(comment2);
        spot2.getImages().add(img2);
        spotRepository.save(spot2);
    }
}
