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
                .profilePhoto("https://i.pravatar.cc/150?img=5")
                .build());

        userList.add(UserEntity.builder()
                .username("michalNowak")
                .email("michal.nowak@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=12")
                .build());

        userList.add(UserEntity.builder()
                .username("kasiaWisniewska")
                .email("kasia.wisniewska@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=20")
                .build());

        userList.add(UserEntity.builder()
                .username("piotrZielinski")
                .email("piotr.zielinski@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=33")
                .build());

        userList.add(UserEntity.builder()
                .username("olaLewandowska")
                .email("ola.lewandowska@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=47")
                .build());

        userList.add(UserEntity.builder()
                .username("tomekWojcik")
                .email("tomek.wojcik@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=56")
                .build());

        userList.add(UserEntity.builder()
                .username("nataliaKaminska")
                .email("natalia.kaminska@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=9")
                .build());

        userList.add(UserEntity.builder()
                .username("bartekSzymanski")
                .email("bartek.szymanski@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=60")
                .build());

        userList.add(UserEntity.builder()
                .username("magdaKozlowska")
                .email("magda.kozlowska@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=25")
                .build());

        userList.add(UserEntity.builder()
                .username("krzysiekJankowski")
                .email("krzysiek.jankowski@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=68")
                .build());

        userList.add(UserEntity.builder()
                .username("julkaMazur")
                .email("julka.mazur@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=15")
                .build());

        userList.add(UserEntity.builder()
                .username("pawelKrawczyk")
                .email("pawel.krawczyk@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=3")
                .build());

        userList.add(UserEntity.builder()
                .username("agataDabrowska")
                .email("agata.dabrowska@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=6")
                .build());

        userList.add(UserEntity.builder()
                .username("kamilKaczmarek")
                .email("kamil.kaczmarek@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=18")
                .build());

        userList.add(UserEntity.builder()
                .username("weronikaWrobel")
                .email("weronika.wrobel@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=27")
                .build());

        userList.add(UserEntity.builder()
                .username("mateuszPawlak")
                .email("mateusz.pawlak@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=34")
                .build());

        userList.add(UserEntity.builder()
                .username("zuzannaNowicka")
                .email("zuzanna.nowicka@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=41")
                .build());

        userList.add(UserEntity.builder()
                .username("lukaszMichalski")
                .email("lukasz.michalski@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=52")
                .build());

        userList.add(UserEntity.builder()
                .username("karolinaSikora")
                .email("karolina.sikora@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=58")
                .build());

        userList.add(UserEntity.builder()
                .username("konradBorkowski")
                .email("konrad.borkowski@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=63")
                .build());

        userList.add(UserEntity.builder()
                .username("dominikaCzarnecka")
                .email("dominika.czarnecka@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=70")
                .build());

        userList.add(UserEntity.builder()
                .username("patrykRutkowski")
                .email("patryk.rutkowski@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=74")
                .build());


        userEntityRepository.saveAll(userList);
    }
}
