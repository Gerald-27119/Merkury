package com.merkury.vulcanus.model.repositories.chat;

import com.merkury.vulcanus.model.entities.chat.Chat;
import com.merkury.vulcanus.model.projections.UsernameChatId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    Page<Chat> findAllByParticipantsUserUsername(String username, Pageable pageable);

    Boolean existsByIdAndParticipantsUserUsername(Long chatId, String username);

    @Query("""
            select chat
            from chats chat
            where chat.chatType = com.merkury.vulcanus.model.enums.chat.ChatType.PRIVATE
              and exists (
                select 1 from ChatParticipant participant1
                where participant1.chat = chat and participant1.user.username = :username1
              )
              and exists (
                select 1 from ChatParticipant participant2
                where participant2.chat = chat and participant2.user.username = :username2
              )
            """)
    Optional<Chat> findPrivateBetween(String username1, String username2);

    @Query("""
            select u.username as username, c.id as chatId
            from chats c
            join c.participants pOwner
            join c.participants pOther
            join pOther.user u
            where c.chatType = com.merkury.vulcanus.model.enums.chat.ChatType.PRIVATE
              and pOwner.user.username = :owner
              and u.username in :others
              and pOwner <> pOther
              and size(c.participants) = 2
            """)
    List<UsernameChatId> findPrivateChatsWithOthers(String owner, Collection<String> others);

}
