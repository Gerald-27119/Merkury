package com.merkury.vulcanus.features.spot;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.merkury.vulcanus.exception.exceptions.BlobContainerNotFoundException;
import com.merkury.vulcanus.exception.exceptions.CommentAccessException;
import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidFileTypeException;
import com.merkury.vulcanus.exception.exceptions.SpotMediaNumberOfMediaExceeded;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.features.account.UserDataService;
import com.merkury.vulcanus.features.azure.AzureBlobService;
import com.merkury.vulcanus.features.vote.VoteService;
import com.merkury.vulcanus.model.dtos.spot.comment.SpotCommentAddDto;
import com.merkury.vulcanus.model.dtos.spot.comment.SpotCommentDto;
import com.merkury.vulcanus.model.dtos.spot.comment.SpotCommentEditDto;
import com.merkury.vulcanus.model.dtos.spot.comment.SpotCommentMediaDto;
import com.merkury.vulcanus.model.dtos.spot.comment.SpotCommentUserVoteInfoDto;
import com.merkury.vulcanus.model.entities.spot.SpotComment;
import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.entities.spot.SpotCommentMedia;
import com.merkury.vulcanus.model.entities.spot.SpotMedia;
import com.merkury.vulcanus.model.enums.AzureBlobFileValidatorType;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import com.merkury.vulcanus.model.mappers.UserMapper;
import com.merkury.vulcanus.model.mappers.spot.SpotCommentMapper;
import com.merkury.vulcanus.model.mappers.spot.SpotCommentMediaMapper;
import com.merkury.vulcanus.model.repositories.SpotCommentMediaRepository;
import com.merkury.vulcanus.model.repositories.SpotCommentRepository;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.security.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotCommentService {

    private final SpotCommentRepository spotCommentRepository;
    private final SpotRepository spotRepository;
    private final UserDataService userDataService;
    private final VoteService voteService;
    private final SpotCommentMediaRepository spotCommentMediaRepository;
    private final CustomUserDetailsService customUserDetailsService;
    private final AzureBlobService azureBlobService;
    private final UserEntityRepository userEntityRepository;

    public Page<SpotCommentDto> getCommentsBySpotId(HttpServletRequest request, Long spotId, Pageable pageable) throws UserNotFoundException {
        Page<SpotComment> commentsPage = spotCommentRepository.findBySpotIdOrderByPublishDateDescIdAsc(spotId, pageable);
        var user = userDataService.isJwtPresent(request) ? userDataService.getUserFromRequest(request) : null;

        return commentsPage.map(comment -> SpotCommentMapper.toDto(comment, user));
    }

    public List<SpotCommentMediaDto> getRestOfSpotCommentMedia(Long spotId, Long commentId) {
        return spotCommentMediaRepository.findBySpotCommentIdAndSpotCommentSpotId(spotId, commentId).stream().map(SpotCommentMediaMapper::toDto).toList();
    }

    public void addComment(String spotCommentJson, List<MultipartFile> mediaFiles, Long spotId) throws SpotNotFoundException, InvalidFileTypeException, BlobContainerNotFoundException, IOException, UserNotFoundException, SpotMediaNumberOfMediaExceeded {
        var user = customUserDetailsService.loadUserDetailsFromSecurityContext();
        var spot = spotRepository.findById(spotId).orElseThrow(() -> new SpotNotFoundException(spotId));
        var mapper = new ObjectMapper();
        var spotComment = mapper.readValue(spotCommentJson, SpotCommentAddDto.class);
        if (mediaFiles != null && mediaFiles.size() > 20) {
            throw new SpotMediaNumberOfMediaExceeded();
        }
        var author = userEntityRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new UserNotFoundException(String.format("User with %s not found", user.getUsername())));

        var spotCommentEntity = SpotCommentMapper.toEntity(spotComment, spot, author);
        List<SpotCommentMedia> mediaEntities = new ArrayList<>();
        if (mediaFiles != null) {
            for (MultipartFile file : mediaFiles) {
                String blobUrl = azureBlobService.upload("mapa", file, AzureBlobFileValidatorType.DEFAULT);

                SpotCommentMedia spotCommentMedia = SpotCommentMedia.builder()
                        .url(blobUrl)
                        .genericMediaType(getMediaType(file))
                        .spotComment(spotCommentEntity)
                        .build();
                mediaEntities.add(spotCommentMedia);
            }
        }

        spotCommentEntity.setMedia(mediaEntities);
        spotCommentRepository.save(spotCommentEntity);
        updateSpotRating(spot);
    }

    public SpotCommentUserVoteInfoDto getVoteInfo(long commentId) {
        var username = customUserDetailsService.loadUserDetailsFromSecurityContext().getUsername();
        return voteService.getVoteInfo(commentId, username);
    }

    public void deleteComment(HttpServletRequest request, Long commentId) throws CommentAccessException, UserNotFoundException {
        var user = userDataService.getUserFromRequest(request);
        var comment = spotCommentRepository.findCommentByIdAndAuthor(commentId, user).orElseThrow(() -> new CommentAccessException("delete"));

        spotCommentRepository.delete(comment);
        updateSpotRating(comment.getSpot());
    }

    public void editComment(HttpServletRequest request, Long commentId, SpotCommentEditDto dto) throws CommentAccessException, UserNotFoundException {
        var user = userDataService.getUserFromRequest(request);
        var comment = spotCommentRepository.findCommentByIdAndAuthor(commentId, user).orElseThrow(() -> new CommentAccessException("edit"));

        comment.setText(dto.text());
        comment.setRating(dto.rating());

        spotCommentRepository.save(comment);
        updateSpotRating(comment.getSpot());
    }

    private Double calculateSpotRating(Long spotId) {
        var comments = spotCommentRepository.findBySpotId(spotId);

        if (comments.isEmpty()) {
            return 0.0;
        }

        double average = comments.stream()
                .mapToDouble(SpotComment::getRating)
                .average()
                .orElse(0.0);

        return BigDecimal.valueOf(average).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    private void updateSpotRating(Spot spot) {
        spot.setRating(calculateSpotRating(spot.getId()));
        spot.setRatingCount(spot.getRatingCount() + 1);
        spotRepository.save(spot);
    }

    public void voteComment(HttpServletRequest request, Long commentId, boolean isUpvote) throws UserNotFoundException, CommentNotFoundException {
        var user = userDataService.getUserFromRequest(request);
        var comment = spotCommentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException(commentId));

        voteService.vote(comment, user, isUpvote);
        spotCommentRepository.save(comment);
    }

    private GenericMediaType getMediaType(MultipartFile file) {
        var contentType = file.getContentType();
        if (contentType != null && contentType.startsWith("image")) return GenericMediaType.PHOTO;
        return GenericMediaType.VIDEO;
    }
}
