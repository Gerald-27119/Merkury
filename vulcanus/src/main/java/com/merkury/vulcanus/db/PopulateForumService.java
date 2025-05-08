package com.merkury.vulcanus.db;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.Category;
import com.merkury.vulcanus.model.entities.forum.Post;
import com.merkury.vulcanus.model.entities.forum.Tag;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.enums.UserRole;
import com.merkury.vulcanus.model.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PopulateForumService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final PostCommentRepository postCommentRepository;
    private final UserEntityRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void initForumDb() {

        UserEntity forumUser = UserEntity.builder()
                .email("forumUser@gmail.com")
                .username("forumUser")
                .password(passwordEncoder.encode("password"))
                .provider(Provider.NONE)
                .userRole(UserRole.ROLE_USER)
                .build();

        Category category1 = Category.builder()
                .name("Drone for begginers")
                .description("Getting started with drones.")
                .colour("bg-yellow-500")
                .build();

        Category category2 = Category.builder()
                .name("Spots")
                .description("Best places to fly.")
                .colour("bg-blue-500")
                .build();

        Category category3 = Category.builder()
                .name("Event")
                .description("Meetups and drone events.")
                .colour("bg-indigo-600")
                .build();

        Category category4 = Category.builder()
                .name("Best place for photos")
                .description("Top photo-worthy locations.")
                .colour("bg-red-500")
                .build();

        Category category5 = Category.builder()
                .name("Build first drone")
                .description("DIY drone building tips.")
                .colour("bg-green-500")
                .build();

        Category category6 = Category.builder()
                .name("FPV")
                .description("All about FPV flying.")
                .colour("bg-pink-500")
                .build();

        Tag tag1 = Tag.builder()
                .name("Gdańsk")
                .build();

        Tag tag2 = Tag.builder()
                .name("Warszawa")
                .build();

        Tag tag3 = Tag.builder()
                .name("Kraków")
                .build();

        Tag tag4 = Tag.builder()
                .name("Gdynia")
                .build();

        Tag tag5 = Tag.builder()
                .name("Chełm")
                .build();

        Post post1 = Post.builder()
                .title("Beginner FPV drone recommendations?")
                .content("""
                        <p>Hey everyone! I'm new to the FPV world and would love some advice.</p>
                        <p>I’m looking for something reliable under <strong>2000 PLN (~$500)</strong>.</p>
                        <p>Ideally something <em>easy to fly</em> but still fast enough to get that FPV thrill!</p>
                        """)
                .category(category1)
                .tags(Set.of(tag1, tag2))
                .views(254)
                .upvotes(37)
                .downvotes(3)
                .author(forumUser)
                .publishDate(LocalDateTime.of(2024, 9, 3, 12, 15))
                .comments(new ArrayList<>())
                .build();

        Post post2 = Post.builder()
                .title("Best FPV spots in Gdańsk?")
                .content("""
                        <p>Hey pilots! I’ve been flying my custom EX-4 that hits 200km/h, and I’m looking for some chill places in <strong>Gdańsk</strong> where I won’t immediately get reported to the police 😅</p>
                        <p>Any parks or abandoned areas worth checking out? Bonus points if it's near water!</p>
                        """)
                .category(category1)
                .tags(Set.of(tag1))
                .views(403)
                .upvotes(61)
                .downvotes(7)
                .author(forumUser)
                .publishDate(LocalDateTime.of(2024, 8, 22, 10, 20))
                .comments(new ArrayList<>())
                .build();

        Post post3 = Post.builder()
                .title("Best FPV goggles under 700 PLN?")
                .content("""
                        <p>Budget FPV goggles – what is worth buying for a start for under PLN 700?</p>
                        <p>It can be a box, the important thing is that it is comfortable and you can see something.</p>
                        """)
                .category(category6)
                .tags(Set.of(tag3))
                .views(189)
                .upvotes(24)
                .downvotes(1)
                .author(forumUser)
                .publishDate(LocalDateTime.of(2024, 10, 5, 9, 10))
                .comments(new ArrayList<>())
                .build();

        Post post4 = Post.builder()
                .title("Starting FPV without soldering – is it possible?")
                .content("""
                        <p>Hi all! I'm excited to get into FPV, but <strong>I'm not great with electronics</strong> and I’ve never used a soldering iron.</p>
                        <p>Are there any real RTF (ready-to-fly) kits out there that don’t need any soldering?</p>
                        <p>Any beginner-friendly options or brands to check out?</p>
                        """)
                .category(category6)
                .tags(new HashSet<>())
                .views(327)
                .upvotes(41)
                .downvotes(6)
                .author(forumUser)
                .publishDate(LocalDateTime.of(2024, 7, 19, 14, 35))
                .comments(new ArrayList<>())
                .build();

        Post post5 = Post.builder()
                .title("Any good flying spots in Gdynia?")
                .content("""
                        <p>Hi! I'm looking for scenic and safe spots in <strong>Gdynia</strong> to fly my drone.</p>
                        <p>Preferably somewhere away from factories and heavy crowds. Also looking for places with a nice view for <em>photoshoots</em>.</p>
                        <p>This is the kind of view I'm aiming for:</p>
                        <img src="https://cdn.example.com/images/spot-gdynia.jpg" alt="Gdynia Spot">
                        """)
                .category(category4)
                .tags(Set.of(tag4))
                .views(518)
                .upvotes(73)
                .downvotes(2)
                .author(forumUser)
                .publishDate(LocalDateTime.of(2024, 6, 30, 17, 5))
                .comments(new ArrayList<>())
                .build();

        userRepository.save(forumUser);
        categoryRepository.saveAll(List.of(category1, category2, category3, category4, category5, category6));
        tagRepository.saveAll(List.of(tag1, tag2, tag3, tag4, tag5));
        postRepository.saveAll(List.of(post1, post2, post3, post4, post5));
    }
}
