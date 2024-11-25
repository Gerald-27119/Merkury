package com.merkury.vulcanus.model.repositories;

import com.merkury.vulcanus.model.entities.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MessageRepository extends MongoRepository<Message, String> {
}

