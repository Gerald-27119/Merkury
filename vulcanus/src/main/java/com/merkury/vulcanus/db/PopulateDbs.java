package com.merkury.vulcanus.db;

import com.merkury.vulcanus.db.services.PopulateChatsService;
import com.merkury.vulcanus.db.services.PopulateFavoriteSpotsService;
import com.merkury.vulcanus.db.services.PopulateForumService;
import com.merkury.vulcanus.db.services.PopulateFriendsService;
import com.merkury.vulcanus.db.services.PopulateMapService;
import com.merkury.vulcanus.db.services.PopulateUsersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class PopulateDbs {

    private final PopulateMapService populateMapService;
    private final PopulateUsersService populateUsersService;
    private final PopulateForumService populateForumService;
    private final PopulateChatsService populateChatsService;
    private final PopulateFriendsService populateFriendsService;
    private final PopulateFavoriteSpotsService populateFavoriteSpotsService;

    @Order(1)
    @Bean
    CommandLineRunner initUsers() {
        return args -> populateUsersService.initUserData();
    }

    @Order(2)
    @Bean
    CommandLineRunner initFriends() {
        return args -> populateFriendsService.initFriendsData();
    }

    @Order(3)
    @Bean
    CommandLineRunner initMap() {
        return args -> populateMapService.initMapData();
    }

    @Order(4)
    @Bean
    CommandLineRunner initForum() {
        return args -> populateForumService.initForumData();
    }

    @Order(5)
    @Bean
    CommandLineRunner initChats() {
        return args -> populateChatsService.initChatsData();
    }

    @Order(6)
    @Bean
    CommandLineRunner initFavoriteSpots() {
        return args -> populateFavoriteSpotsService.initFavoriteSpotsData();
    }
}
