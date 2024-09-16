package com.merkury.vulcanus.message;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

public interface MessageRepository extends MongoRepository<Message, String> {
}

