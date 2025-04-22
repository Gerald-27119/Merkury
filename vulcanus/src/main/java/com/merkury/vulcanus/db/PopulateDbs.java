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
    private final PopulateChatDataService populateChatDataService;


    @Bean
    CommandLineRunner initPostgresDb() {
        return args -> populateDbsService.initPostgresDb();
    }

    @Bean
    CommandLineRunner initChatData() {
        return args -> populateChatDataService.initChatData();
    }
}
