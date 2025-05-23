package com.merkury.vulcanus.model.entities;

import com.merkury.vulcanus.model.entities.forum.Post;
import com.merkury.vulcanus.model.entities.chat.Chat;
import com.merkury.vulcanus.model.entities.chat.ChatInvitation;
import com.merkury.vulcanus.model.entities.chat.ChatMessage;
import com.merkury.vulcanus.model.entities.chat.ChatParticipant;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "users")
public class UserEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String profileImage;
    private String email;
    private String username;
    private String password;
    @Builder.Default
    private String profilePhoto = "https://ucarecdn.com/ac4ffacd-8416-4d90-9613-35fb472a932d/defaultProfilePhoto.jpg";

    /**
     * Default lazy loading: Images are not loaded immediately with the UserEntity.
     * Implication: Accessing this collection outside an active transaction will
     * throw a LazyInitializationException.
     * Benefit: Improves performance by loading the collection only when needed.
     **/
    @Builder.Default
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Img> images = new ArrayList<>();

    /**
     * Default lazy loading: Favorite spots are loaded only when explicitly accessed.
     * Implication: Improper use of this collection outside a transaction can result
     * in LazyInitializationException.
     * Reason: Avoids unnecessary fetching of potentially large collections
     * unless required.
     **/
    @Builder.Default
    @ManyToMany
    @JoinTable(
            name = "user_favorite_spots",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "spot_id")
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Spot> favoriteSpots = new ArrayList<>();

    @Builder.Default
    @ManyToMany
    @JoinTable(
            name = "user_followed_posts",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    private List<Post> followedPosts = new ArrayList<>();

    @Builder.Default
    @Enumerated(value = EnumType.STRING)
    private UserRole userRole = UserRole.ROLE_USER;

    @Builder.Default
    @Enumerated(value = EnumType.STRING)
    private Provider provider = Provider.NONE;

    /**
     * Default lazy loading: Friendships are loaded on-demand.
     * Implication: Direct access to this collection outside a transaction
     * will result in LazyInitializationException.
     * Purpose: Optimizes memory and database performance by avoiding eager
     * loading of relationships.
     **/
    @Builder.Default
    @ToString.Exclude
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Friendship> friendships = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();

    @ManyToMany
    @EqualsAndHashCode.Exclude
    @JoinTable(
            name = "user_followers",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id")
    )
    @ToString.Exclude
    @Builder.Default
    private Set<UserEntity> followers = new HashSet<>();

    @ManyToMany(mappedBy = "followers")
    @ToString.Exclude
    @Builder.Default
    @EqualsAndHashCode.Exclude
    private Set<UserEntity> followed = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<SpotComment> spotComments = new ArrayList<>();

    @OneToMany(
            mappedBy = "receiver",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<ChatInvitation> receivedInvitations = new ArrayList<>();

    @OneToMany(
            mappedBy = "sender",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<ChatInvitation> sentInvitations = new ArrayList<>();


    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<ChatParticipant> chatParticipations = new ArrayList<>();

    public List<Chat> getChats() {
        return chatParticipations.stream()
                .map(ChatParticipant::getChat)
                .toList();
    }

    @Builder.Default
    @OneToMany(mappedBy = "sender",
            cascade = CascadeType.REMOVE,
            orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<ChatMessage> sentMessages = new ArrayList<>();

    @Builder.Default
    private Boolean accountNonExpired = true;
    @Builder.Default
    private Boolean accountNonLocked = true;
    @Builder.Default
    private Boolean credentialsNonExpired = true;
    @Builder.Default
    private Boolean enabled = true;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(userRole.name()));
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }
}
