package com.merkury.vulcanus.model.entities;

import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "users")
public class UserEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String username;
    private String password;

    /**
     * Default lazy loading: Images are not loaded immediately with the UserEntity.
     * Implication: Accessing this collection outside an active transaction will throw a LazyInitializationException.
     * Benefit: Improves performance by loading the collection only when needed.
     **/
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Img> images;

    /**
     *  Default lazy loading: Favorite spots are loaded only when explicitly accessed.
     *  Implication: Improper use of this collection outside a transaction can result in LazyInitializationException.
     *  Reason: Avoids unnecessary fetching of potentially large collections unless required.
     **/
    @ManyToMany
    @JoinTable(
            name = "user_favorite_spots",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "spot_id")
    )
    private List<Spot> favoriteSpots = new ArrayList<>();

    @Enumerated(value = EnumType.STRING)
    private UserRole userRole;

    @Enumerated(value = EnumType.STRING)
    private Provider provider;

    /**
     * Default lazy loading: Friendships are loaded on-demand.
     * Implication: Direct access to this collection outside a transaction will result in LazyInitializationException.
     * Purpose: Optimizes memory and database performance by avoiding eager loading of relationships.
     **/
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Friendship> friendships = new ArrayList<>();

    private Boolean accountNonExpired = true;
    private Boolean accountNonLocked = true;
    private Boolean credentialsNonExpired = true;
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
