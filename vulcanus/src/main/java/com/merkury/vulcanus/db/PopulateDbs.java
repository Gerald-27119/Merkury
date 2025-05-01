package com.merkury.vulcanus.db;


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

    private final PopulateDbsService populateDbsService;
    private final PopulateForumService populateForumService;
    private final PopulateChatsService populateChatsService;

    @Order(2)
    @Bean
    CommandLineRunner initPostgresDb() {
        return args -> populateDbsService.initPostgresDb();
    }

    @Order(1)
    @Bean
    CommandLineRunner initChats() {
        return args -> populateChatsService.initChatData();
    }

    @Order(3)
    @Bean
    CommandLineRunner initForumDb() {
        return args -> populateForumService.initForumDb();
    }
}
