package com.merkury.vulcanus.db.services;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class PopulateUsersService {

    private final UserEntityRepository userEntityRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void initUserData() {
        var userList = new ArrayList<UserEntity>();

        userList.add(UserEntity.builder()
                .username("annaKowalska")
                .email("anna.kowalska@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/c4bddb9c-797f-45d8-9f30-39251788e008.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("michalNowak")
                .email("michal.nowak@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/1bd61d4b-c38e-49c4-b44c-15e16a4ec381.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("kasiaWisniewska")
                .email("kasia.wisniewska@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/f9324c4e-82a1-4883-972c-09dd1cdc6ca1.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("piotrZielinski")
                .email("piotr.zielinski@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/b8729678-d851-44c7-9d59-75af14e0b30c.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("olaLewandowska")
                .email("ola.lewandowska@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/542a1434-0799-483a-a9c6-83fcb60bfe6e.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("tomekWojcik")
                .email("tomek.wojcik@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/6950f5d7-1d05-470b-9a0b-1d046cac794a.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("nataliaKaminska")
                .email("natalia.kaminska@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/24bed962-b2eb-48ed-9f2f-cd2e3fdf43cb.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("bartekSzymanski")
                .email("bartek.szymanski@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/c033eeac-c0c4-4bbb-87a6-581cf1eb8d90.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("magdaKozlowska")
                .email("magda.kozlowska@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/8a9ea5c5-220c-4ac0-8dbd-14fadc061777.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("krzysJankowski")
                .email("krzys.jankowski@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/a719e0d4-9abd-4607-836c-294cd3bea64d.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("julkaMazur")
                .email("julka.mazur@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/08ae1eb4-5ee1-42c1-a792-72a0b5310caf.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("pawelKrawczyk")
                .email("pawel.krawczyk@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/f30bcf5b-c480-48df-9a2a-8c07e690e095.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("agataDabrowska")
                .email("agata.dabrowska@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/329a37ea-a03b-4e10-831f-c507135354d0.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("kamilKaczmarek")
                .email("kamil.kaczmarek@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/8ecfe675-40bf-4998-a70a-33d282964260.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("weronikaWrobel")
                .email("weronika.wrobel@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/b6df56b8-eff3-4825-9124-897ddb8a695d.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("mateuszPawlak")
                .email("mateusz.pawlak@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/83e6ffe8-0933-4405-be9d-56519256c7fc.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("zuzannaNowicka")
                .email("zuzanna.nowicka@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/c609beaa-4fb1-4384-b5b0-f05a069af275.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("lukaszMichalski")
                .email("lukasz.michalski@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/c367bfec-7502-4b8d-b3a4-ba0e6375d6c2.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("karolinaSikora")
                .email("karolina.sikora@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/bc19bb64-f361-4a1b-92a1-06fb41b614df.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("konradBorkowski")
                .email("konrad.borkowski@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/a526cf13-7175-445d-b3bd-4a3d3266cee7.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("magdaCzarnecka")
                .email("magdaCzarnecka.czarnecka@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/3257bea1-ea05-428f-9277-4b2a91b916c1.jpg")
                .build());

        userList.add(UserEntity.builder()
                .username("patrykRutkowski")
                .email("patryk.rutkowski@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://merkurystorage.blob.core.windows.net/user-profile/08fb5c80-e914-49c9-a5fd-c9c05c2c4da1.jpg")
                .build());


        userEntityRepository.saveAll(userList);
    }
}
