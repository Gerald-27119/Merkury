package com.merkury.vulcanus.db;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class PopulateDbs {

    private final PopulateDbsService populateDbsService;
    private final PopulateChatsService populateChatsService;
    private final PopulateUsersService populateUsersService;


    @Bean
    CommandLineRunner initPostgresDb() {
        return args -> populateDbsService.initPostgresDb();
    }

    @Bean
    CommandLineRunner initUsers() {
        return args -> populateUsersService.initUsers();
    }

    @Bean
    CommandLineRunner initChats() {
        return args -> populateChatsService.initChatData();
    }

}
