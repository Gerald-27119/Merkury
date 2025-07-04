package com.merkury.vulcanus.db.services;

import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.PostCategory;
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
    private final PostCategoryRepository postCategoryRepository;
    private final TagRepository tagRepository;
    private final UserEntityRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void initForumData() {

        UserEntity forumUser = UserEntity.builder()
                .email("forumUser@gmail.com")
                .username("forumUser")
                .password(passwordEncoder.encode("password"))
                .provider(Provider.NONE)
                .userRole(UserRole.ROLE_USER)
                .build();

        PostCategory postCategory1 = PostCategory.builder()
                .name("Drone for beginners")
                .description("Getting started with drones.")
                .colour("#eab308")
                .build();

        PostCategory postCategory2 = PostCategory.builder()
                .name("Spots")
                .description("Best places to fly.")
                .colour("#3b82f6")
                .build();

        PostCategory postCategory3 = PostCategory.builder()
                .name("Event")
                .description("Meetups and drone events.")
                .colour("#4f46e5")
                .build();

        PostCategory postCategory4 = PostCategory.builder()
                .name("Best place for photos")
                .description("Top photo-worthy locations.")
                .colour("#ef4444")
                .build();

        PostCategory postCategory5 = PostCategory.builder()
                .name("Build first drone")
                .description("DIY drone building tips.")
                .colour("#22c55e")
                .build();

        PostCategory postCategory6 = PostCategory.builder()
                .name("FPV")
                .description("All about FPV flying.")
                .colour("#ec4899")
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
                .postCategory(postCategory1)
                .tags(Set.of(tag1, tag2))
                .views(254)
                .upVotes(37)
                .downVotes(3)
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
                .postCategory(postCategory1)
                .tags(Set.of(tag1))
                .views(403)
                .upVotes(61)
                .downVotes(7)
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
                .postCategory(postCategory6)
                .tags(Set.of(tag3))
                .views(189)
                .upVotes(24)
                .downVotes(1)
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
                .postCategory(postCategory6)
                .tags(new HashSet<>())
                .views(327)
                .upVotes(41)
                .downVotes(6)
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
                .postCategory(postCategory4)
                .tags(Set.of(tag4))
                .views(518)
                .upVotes(73)
                .downVotes(2)
                .author(forumUser)
                .publishDate(LocalDateTime.of(2024, 6, 30, 17, 5))
                .comments(new ArrayList<>())
                .build();

        userRepository.save(forumUser);
        postCategoryRepository.saveAll(List.of(postCategory1, postCategory2, postCategory3, postCategory4, postCategory5, postCategory6));
        tagRepository.saveAll(List.of(tag1, tag2, tag3, tag4, tag5));
        postRepository.saveAll(List.of(post1, post2, post3, post4, post5));
    }
}
