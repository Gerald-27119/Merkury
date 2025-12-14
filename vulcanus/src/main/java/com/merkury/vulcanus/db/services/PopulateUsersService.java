package com.merkury.vulcanus.db.services;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

import static com.merkury.vulcanus.model.enums.UserRole.ROLE_ADMIN;

@Service
@RequiredArgsConstructor
public class PopulateUsersService {

    private final UserEntityRepository userEntityRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void initUserData() {

        var userList = new ArrayList<UserEntity>();

        var admin = UserEntity.builder()
                .username("admin")
                .email("admin@example.com")
                .password(passwordEncoder.encode("password"))
                .userRole(ROLE_ADMIN)
                .build();
        userList.add(admin);

//        var user = UserEntity.builder()
//                .username("user")
//                .email("user@example.com")
//                .password(passwordEncoder.encode("password"))
//                .profilePhoto("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
//                .build();
//        userList.add(user);

        userList.add(UserEntity.builder()
                .username("adamLangmesser")
                .email("adam.langmesser@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=5")
                .build());

        userList.add(UserEntity.builder()
                .username("stanislawOziemczuk")
                .email("stanislaw.oziemczuk@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=5")
                .build());

        userList.add(UserEntity.builder()
                .username("kacperBadek")
                .email("kacper.badek@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=5")
                .build());

        userList.add(UserEntity.builder()
                .username("mateuszRedosz")
                .email("mateusz.redosz@example.com")
                .password(passwordEncoder.encode("Password1!"))
                .profilePhoto("https://i.pravatar.cc/150?img=5")
                .build());

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

        userEntityRepository.saveAll(userList);
    }
}
