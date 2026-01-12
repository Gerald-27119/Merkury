package com.merkury.vulcanus.features.forum;

import com.merkury.vulcanus.exception.exceptions.BlobContainerNotFoundException;
import com.merkury.vulcanus.features.azure.AzureBlobService;
import com.merkury.vulcanus.model.entities.forum.Post;
import com.merkury.vulcanus.model.entities.forum.PostComment;
import com.merkury.vulcanus.model.entities.forum.PostCommentMedia;
import com.merkury.vulcanus.model.entities.forum.PostMedia;
import com.merkury.vulcanus.model.repositories.forum.PostCommentMediaRepository;
import com.merkury.vulcanus.model.repositories.forum.PostMediaRepository;
import com.merkury.vulcanus.utils.forum.ForumMediaExtractor;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URISyntaxException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ForumMediaService {

    private final PostMediaRepository postMediaRepository;
    private final PostCommentMediaRepository postCommentMediaRepository;
    private final ForumMediaExtractor forumMediaExtractor;
    private final AzureBlobService azureBlobService;

    private static final String FORUM_CONTAINER = "forum";


    public void savePostMedia(String cleanContent, Post post) {
        var urls = forumMediaExtractor.extractImageUrls(cleanContent);
        var media = createPostMediaEntities(urls, post);

        postMediaRepository.saveAll(media);
    }

    public void savePostCommentMedia(String cleanContent, PostComment comment) {
        var urls = forumMediaExtractor.extractImageUrls(cleanContent);
        var media = createCommentMediaEntities(urls, comment);

        postCommentMediaRepository.saveAll(media);
    }

    @Transactional
    public void editPostMedia(String cleanContent, Post post) throws BlobContainerNotFoundException, URISyntaxException {
        var existingMedia = postMediaRepository.findByPostId(post.getId());

        var oldUrls = existingMedia.stream()
                .map(PostMedia::getUrl)
                .collect(Collectors.toSet());

        var newUrls = new HashSet<>(forumMediaExtractor.extractImageUrls(cleanContent));

        var toDelete = getUrlsToDelete(newUrls, oldUrls);
        var toAdd = getUrlsToAdd(newUrls, oldUrls);

        deleteUrls(toDelete, postMediaRepository::deleteAllByUrlIn);
        var newMediaEntities = createPostMediaEntities(toAdd, post);

        postMediaRepository.saveAll(newMediaEntities);
    }

    @Transactional
    public void editPostCommentMedia(String cleanContent, PostComment comment) throws BlobContainerNotFoundException, URISyntaxException {
        var existingMedia = postCommentMediaRepository.findByPostCommentId(comment.getId());

        var oldUrls = existingMedia.stream()
                .map(PostCommentMedia::getUrl)
                .collect(Collectors.toSet());

        var newUrls = new HashSet<>(forumMediaExtractor.extractImageUrls(cleanContent));

        var toDelete = getUrlsToDelete(newUrls, oldUrls);
        var toAdd = getUrlsToAdd(newUrls, oldUrls);

        deleteUrls(toDelete, postCommentMediaRepository::deleteAllByUrlIn);
        var newMediaEntities = createCommentMediaEntities(toAdd, comment);

        postCommentMediaRepository.saveAll(newMediaEntities);
    }

    public void deletePostMedia(Long postId) throws BlobContainerNotFoundException, URISyntaxException {
        var existingMedia = postMediaRepository.findByPostId(postId).stream().map(PostMedia::getUrl).toList();
        azureBlobService.deleteBatch(FORUM_CONTAINER, existingMedia);
    }

    @Transactional
    public void deletePostCommentMedia(Long commentId) throws BlobContainerNotFoundException, URISyntaxException {
        var existingMedia = postCommentMediaRepository.findByPostCommentId(commentId).stream().map(PostCommentMedia::getUrl).toList();
        azureBlobService.deleteBatch(FORUM_CONTAINER, existingMedia);
        //this line is required since comments only get "soft deleted"
        postCommentMediaRepository.deleteByPostCommentId(commentId);
    }

    private List<PostMedia> createPostMediaEntities(List<String> urls, Post post) {
        return urls.stream().distinct()
                .map(url -> PostMedia.builder()
                        .url(url)
                        .type("image")
                        .post(post)
                        .build())
                .toList();
    }

    private List<PostCommentMedia> createCommentMediaEntities(List<String> urls, PostComment comment) {
        return urls.stream().distinct()
                .map(url -> PostCommentMedia.builder()
                        .url(url)
                        .type("image")
                        .postComment(comment)
                        .build())
                .toList();
    }


    private List<String> getUrlsToAdd(Set<String> newUrls, Set<String> oldUrls) {
        return newUrls.stream()
                .filter(url -> !oldUrls.contains(url))
                .toList();
    }

    private List<String> getUrlsToDelete(Set<String> newUrls, Set<String> oldUrls) {
        return oldUrls.stream()
                .filter(url -> !newUrls.contains(url))
                .toList();
    }

    private void deleteUrls(List<String> urls, Consumer<List<String>> deleteBatch) throws BlobContainerNotFoundException, URISyntaxException {
        azureBlobService.deleteBatch(FORUM_CONTAINER, urls);
        deleteBatch.accept(urls);
    }
}
