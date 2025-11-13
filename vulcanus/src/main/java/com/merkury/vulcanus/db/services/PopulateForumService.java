package com.merkury.vulcanus.db.services;

import com.merkury.vulcanus.model.entities.Friendship;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.PostCategory;
import com.merkury.vulcanus.model.entities.forum.Post;
import com.merkury.vulcanus.model.entities.forum.PostComment;
import com.merkury.vulcanus.model.entities.forum.Tag;
import com.merkury.vulcanus.model.enums.user.dashboard.UserFriendStatus;
import com.merkury.vulcanus.model.interfaces.Votable;
import com.merkury.vulcanus.model.repositories.*;
import com.merkury.vulcanus.model.repositories.forum.PostCategoryRepository;
import com.merkury.vulcanus.model.repositories.forum.PostCommentRepository;
import com.merkury.vulcanus.model.repositories.forum.PostRepository;
import com.merkury.vulcanus.model.repositories.forum.PostTagRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PopulateForumService {

    private final PostRepository postRepository;
    private final PostCommentRepository commentRepository;
    private final PostCategoryRepository postCategoryRepository;
    private final PostTagRepository postTagRepository;
    private final UserEntityRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Random random = new Random();

    @Transactional
    public void initForumData() {

        var postList = new ArrayList<Post>();
        var forumUsers = userRepository.findAll().subList(1, 102);
        var voteUsers = userRepository.findAll().subList(20, 40);

        UserEntity forumUser = UserEntity.builder()
                .email("forumUser@gmail.com")
                .username("forumUser")
                .password(passwordEncoder.encode("password"))
                .build();

        UserEntity forumUserFriend = UserEntity.builder()
                .email("forumUserFriend@gmail.com")
                .username("forumUserFriend")
                .password(passwordEncoder.encode("password"))
                .build();

        Friendship friendship = Friendship.builder()
                .user(forumUser)
                .friend(forumUserFriend)
                .status(UserFriendStatus.ACCEPTED)
                .createdAt(LocalDateTime.now())
                .build();

        Friendship reverseFriendship = Friendship.builder()
                .user(forumUserFriend)
                .friend(forumUser)
                .status(UserFriendStatus.ACCEPTED)
                .createdAt(LocalDateTime.now())
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
                .name("Best place for media")
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
                        <p>Hey everyone! I'm new to the FPV world and would love some advice.
                        I’m looking for something reliable under <strong>2000 PLN (~$500)</strong>.
                        Ideally something <em>easy to fly</em> but still fast enough to get that FPV thrill!</p>
                        """)
                .postCategory(postCategory1)
                .tags(Set.of(tag1, tag2))
                .views(254)
                .author(forumUser)
                .publishDate(LocalDateTime.of(2025, 10, 15, 12, 15))
                .comments(new ArrayList<>())
                .build();

        Post post2 = Post.builder()
                .title("Best FPV spots in Gdańsk?")
                .content("""
                        <p>Hey pilots! I’ve been flying my custom EX-4 that hits 200km/h, and I’m looking for some chill places in <strong>Gdańsk</strong> where I won’t immediately get reported to the police 😅.
                        Any parks or abandoned areas worth checking out? Bonus points if it's near water!</p>
                        """)
                .postCategory(postCategory1)
                .tags(Set.of(tag1))
                .views(403)
                .author(forumUser)
                .publishDate(LocalDateTime.of(2025, 10, 22, 10, 20))
                .comments(new ArrayList<>())
                .build();

        Post post3 = Post.builder()
                .title("Best FPV goggles under 700 PLN?")
                .content("""
                        <p>Budget FPV goggles – what is worth buying for a start for under PLN 700?
                        It can be a box, the important thing is that it is comfortable and you can see something.</p>
                        """)
                .postCategory(postCategory6)
                .tags(Set.of(tag3))
                .views(189)
                .author(forumUser)
                .publishDate(LocalDateTime.of(2025, 10, 28, 9, 10))
                .comments(new ArrayList<>())
                .build();

        Post post4 = Post.builder()
                .title("Starting FPV without soldering – is it possible?")
                .content("""
                        <p>Hi all! I'm excited to get into FPV, but <strong>I'm not great with electronics</strong> and I’ve never used a soldering iron.
                        Are there any real RTF (ready-to-fly) kits out there that don’t need any soldering?
                        Any beginner-friendly options or brands to check out?</p>
                        """)
                .postCategory(postCategory6)
                .tags(new HashSet<>())
                .views(327)
                .author(forumUser)
                .publishDate(LocalDateTime.of(2025, 11, 3, 14, 35))
                .comments(new ArrayList<>())
                .build();

        Post post5 = Post.builder()
                .title("Any good flying spots in Gdynia?")
                .content("""
                        <p>Hi! I'm looking for scenic and safe spots in <strong>Gdynia</strong> to fly my drone.
                        Preferably somewhere away from factories and heavy crowds. Also looking for places with a nice view for <em>photoshoots</em>.
                        This is the kind of view I'm aiming for:</p>
                        <img src="https://plannawypad.pl/wp-content/uploads/2023/04/torpedownia-gdynia-babie-doly-7.jpg" alt="Gdynia Spot">
                        """)
                .postCategory(postCategory4)
                .tags(Set.of(tag4))
                .views(518)
                .author(forumUser)
                .publishDate(LocalDateTime.of(2025, 11, 10, 17, 5))
                .comments(new ArrayList<>())
                .build();

        List<PostCategory> allCategories = List.of(
                postCategory1, postCategory2, postCategory3,
                postCategory4, postCategory5, postCategory6
        );
        List<Tag> allTags = List.of(tag1, tag2, tag3, tag4, tag5);
        postList.addAll(List.of(post1, post2, post3, post4, post5));

        for (Post post : postList) {
            assignRandomVotes(post, forumUsers);
        }

        for (int i = 6; i <= 100; i++) {
            var publishDate = LocalDateTime.now().minusDays(2000 + i);

            Set<Tag> randomTags = new HashSet<>();
            int numberOfTags = random.nextInt(4);
            for (int j = 0; j < numberOfTags; j++) {
                randomTags.add(allTags.get(random.nextInt(allTags.size())));
            }

            var postX = Post.builder().title("Post number " + i)
                    .content("""
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                            It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                            """)
                    .postCategory(allCategories.get(random.nextInt(allCategories.size())))
                    .tags(randomTags)
                    .views(random.nextInt(1000 - 100 + 1) + 100)
                    .author(forumUsers.get(random.nextInt(forumUsers.size())))
                    .publishDate(publishDate)
                    .comments(new ArrayList<>())
                    .build();

            assignRandomVotes(postX, forumUsers);
            postList.add(postX);
        }

        List<PostComment> allComments = new ArrayList<>();
        for (Post post : postList) {
            List<PostComment> comments = new ArrayList<>();

            for (int i = 1; i <= 10; i++) {
                PostComment comment = PostComment.builder()
                        .content("<p>Comment</p>")
                        .author(forumUsers.get(random.nextInt(forumUsers.size())))
                        .post(post)
                        .publishDate(post.getPublishDate().plusDays(i))
                        .build();

                assignRandomVotes(comment, voteUsers);
                generateReplies(comment, post, forumUsers, 1, 3);
                comments.add(comment);
            }
            post.getComments().addAll(comments);
            var totalComments = countAllCommentsWithReplies(comments);
            post.setCommentsCount(totalComments);

            allComments.addAll(comments);
        }

        userRepository.saveAll(List.of(forumUser, forumUserFriend));
        forumUser.getFriendships().add(friendship);
        forumUserFriend.getFriendships().add(reverseFriendship);
        userRepository.saveAll(List.of(forumUser, forumUserFriend));
        postCategoryRepository.saveAll(List.of(postCategory1, postCategory2, postCategory3, postCategory4, postCategory5, postCategory6));
        postTagRepository.saveAll(List.of(tag1, tag2, tag3, tag4, tag5));
        postRepository.saveAll(postList);
        commentRepository.saveAll(allComments);
    }

    private void generateReplies(
            PostComment parent,
            Post post,
            List<UserEntity> users,
            int depth,
            int maxDepth
    ) {
        if (depth >= maxDepth) return;

        int repliesCount = random.nextInt(3);
        for (int j = 0; j < repliesCount; j++) {

            UserEntity replyAuthor;
            do {
                replyAuthor = users.get(random.nextInt(users.size()));
            } while (replyAuthor.equals(parent.getAuthor()));

            PostComment reply = PostComment.builder()
                    .content("<p>Reply to comment</p>")
                    .author(replyAuthor)
                    .post(post)
                    .parent(parent)
                    .publishDate(parent.getPublishDate().plusHours(j + depth))
                    .build();

            parent.getReplies().add(reply);
            parent.setRepliesCount(parent.getRepliesCount() + 1);
            generateReplies(reply, post, users, depth + 1, maxDepth);
        }
    }


    private int countAllCommentsWithReplies(List<PostComment> comments) {
        int count = 0;
        for (PostComment comment : comments) {
            count++;
            if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
                count += countAllCommentsWithReplies(comment.getReplies());
            }
        }
        return count;
    }

    private void assignRandomVotes(Votable entity, List<UserEntity> users) {
        Collections.shuffle(users);
        int totalVotes = random.nextInt(users.size());
        int upVoteCount = random.nextInt(totalVotes + 1);

        Set<UserEntity> upVoters = new HashSet<>(users.subList(0, upVoteCount));
        Set<UserEntity> downVoters = new HashSet<>(users.subList(upVoteCount, totalVotes));

        entity.setUpVotedBy(upVoters);
        entity.setDownVotedBy(downVoters);
        entity.setUpVotes(upVoters.size());
        entity.setDownVotes(downVoters.size());
    }


}


