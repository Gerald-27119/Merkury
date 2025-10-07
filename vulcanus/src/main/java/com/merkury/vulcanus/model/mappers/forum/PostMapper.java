package com.merkury.vulcanus.model.mappers.forum;

import com.merkury.vulcanus.model.dtos.forum.PostDetailsDto;
import com.merkury.vulcanus.model.dtos.forum.PostDto;
import com.merkury.vulcanus.model.dtos.forum.PostGeneralDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.PostCategory;
import com.merkury.vulcanus.model.entities.forum.Post;
import com.merkury.vulcanus.model.entities.forum.Tag;
import jakarta.validation.constraints.NotNull;
import org.jsoup.Jsoup;

import java.time.LocalDateTime;
import java.util.Set;

public class PostMapper {

    private PostMapper() {
    }

    public static PostDetailsDto toDetailsDto(@NotNull Post post, UserEntity currentUser) {
        return PostDetailsDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .category(CategoryMapper.toDto(post.getPostCategory()))
                .tags(post.getTags().stream().map(TagMapper::toDto).toList())
                .author(AuthorMapper.toDto(post.getAuthor()))
                .isAuthor(currentUser != null && post.getAuthor().getId().equals(currentUser.getId()))
                .publishDate(post.getPublishDate())
                .views(post.getViews())
                .upVotes(post.getUpVotes())
                .downVotes(post.getDownVotes())
                .isUpVoted(post.getUpVotedBy().contains(currentUser))
                .isDownVoted(post.getDownVotedBy().contains(currentUser))
                .commentsCount(post.getComments().size())
                .build();
    }

    public static PostGeneralDto toGeneralDto(@NotNull Post post, UserEntity currentUser) {
        var summary = summarizeContent(post.getContent());
        var slug = generateSlugTitle(post.getTitle());

        return PostGeneralDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slugTitle(slug)
                .content(summary)
                .category(CategoryMapper.toDto(post.getPostCategory()))
                .tags(post.getTags().stream().map(TagMapper::toDto).toList())
                .views(post.getViews())
                .numberOfComments(post.getComments().size())
                .isAuthor(currentUser != null && post.getAuthor().getId().equals(currentUser.getId()))
                .build();
    }

    public static Post toEntity(@NotNull PostDto postDto, @NotNull UserEntity author, @NotNull PostCategory postCategory, Set<Tag> tags) {
        return Post.builder()
                .title(postDto.title())
                .content(postDto.content())
                .author(author)
                .publishDate(LocalDateTime.now())
                .postCategory(postCategory)
                .tags(tags)
                .build();
    }

    private static String summarizeContent(String content) {
        var doc = Jsoup.parse(content);
        doc.select("img, video, iframe, object, embed, svg").remove();
        String plainText = doc.text();

        if (plainText.length() <= 200) {
            return plainText;
        }

        var lastSpace = plainText.lastIndexOf(" ", 200);
        if (lastSpace == -1) {
            return plainText.substring(0, 200) + "...";
        }

        return plainText.substring(0, lastSpace) + "...";
    }

    private static String generateSlugTitle(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
    }

}
