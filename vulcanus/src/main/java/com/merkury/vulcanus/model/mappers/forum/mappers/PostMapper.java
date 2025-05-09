package com.merkury.vulcanus.model.mappers.forum.mappers;

import com.merkury.vulcanus.model.dtos.forum.PostDetailsDto;
import com.merkury.vulcanus.model.dtos.forum.PostDto;
import com.merkury.vulcanus.model.dtos.forum.PostGeneralDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.entities.forum.Category;
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
                .category(CategoryMapper.toDto(post.getCategory()))
                .tags(post.getTags().stream().map(TagMapper::toDto).toList())
                .author(AuthorMapper.toDto(post.getAuthor()))
                .isAuthor(currentUser != null && post.getAuthor().getId().equals(currentUser.getId()))
                .publishDate(post.getPublishDate())
                .views(post.getViews())
                .upvotes(post.getUpvotes())
                .downvotes(post.getDownvotes())
                .isUpvoted(post.getUpvotedBy().contains(currentUser))
                .isDownvoted(post.getDownvotedBy().contains(currentUser))
                .comments(PostCommentMapper.toDto(post.getComments(), currentUser))
                .build();
    }

    public static PostGeneralDto toGeneralDto(@NotNull Post post, UserEntity currentUser) {
        var summary = summarizeContent(post.getContent());

        return PostGeneralDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(summary)
                .category(CategoryMapper.toDto(post.getCategory()))
                .tags(post.getTags().stream().map(TagMapper::toDto).toList())
                .views(post.getViews())
                .numberOfComments(post.getComments().size())
                .isAuthor(currentUser != null && post.getAuthor().getId().equals(currentUser.getId()))
                .build();
    }

    public static Post toEntity(@NotNull PostDto postDto, @NotNull UserEntity author, @NotNull Category category, Set<Tag> tags) {
        return Post.builder()
                .title(postDto.title())
                .content(postDto.content())
                .author(author)
                .publishDate(LocalDateTime.now())
                .category(category)
                .tags(tags)
                .build();
    }

    private static String summarizeContent(String content){
        var doc = Jsoup.parse(content);
        doc.select("img, video, iframe, object, embed, svg").remove();
        String plainText = doc.text();

        return plainText.length() > 200
                ? plainText.substring(0, plainText.lastIndexOf(" ", 200)) + "..."
                : plainText;
    }

}
