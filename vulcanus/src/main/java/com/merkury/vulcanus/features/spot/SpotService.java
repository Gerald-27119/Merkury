package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.exception.exceptions.CommentNotFoundException;
import com.merkury.vulcanus.exception.exceptions.InvalidCredentialsException;
import com.merkury.vulcanus.exception.exceptions.SpotNotFoundException;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundException;
import com.merkury.vulcanus.model.dtos.CommentDto;
import com.merkury.vulcanus.exception.exceptions.SpotsNotFoundException;
import com.merkury.vulcanus.model.dtos.SpotDto;
import com.merkury.vulcanus.model.mappers.SpotMapper;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotService {

    private final SpotRepository spotRepository;
    private final CommentService commentService;

    private List<SpotDto> getAllSpots() throws SpotsNotFoundException {
        var allSpots = spotRepository.findAll().stream().map(SpotMapper::toDto).toList();
        if (allSpots.isEmpty()) {
            throw new SpotsNotFoundException("Spots not found!");
        }

        return allSpots;
    }

    public SpotDto getSpotById(Long id) throws SpotNotFoundException {
        return spotRepository.findById(id).map(SpotMapper::toDto).orElseThrow(() -> new SpotNotFoundException(id));
    }

    public void addComment(String text, Long spotId, HttpServletRequest request) throws SpotNotFoundException, UserNotFoundException {
        commentService.addComment(text, spotId, request);
    }

    public void editComment(Long commentId, String text, HttpServletRequest request) throws CommentNotFoundException, InvalidCredentialsException {
        commentService.editComment(commentId, text, request);
    }

    public void deleteComment(Long commentId, HttpServletRequest request) throws CommentNotFoundException, InvalidCredentialsException {
        commentService.deleteComment(commentId, request);
    }

    public Page<CommentDto> getCommentsPageBySpotId(Long spotId, int page, int size) throws SpotNotFoundException {
        return commentService.getCommentsPageBySpotId(spotId, page, size);
    }

    public List<SpotDto> getFilteredSpots(String name, Double minRating, Double maxRating) throws SpotsNotFoundException {
        var allSpots = this.getAllSpots();
        var filteredSpots = allSpots.stream()
                .filter(spot -> (name.isBlank() || spot.getName().toLowerCase().contains(name.trim().toLowerCase())) &&
                        (minRating == null || spot.getRating() >= minRating) &&
                        (maxRating == null || spot.getRating() <= maxRating))
                .toList();
        if (filteredSpots.isEmpty()) {
            throw new SpotsNotFoundException("No spots match filters!");
        }

        return filteredSpots;
    }

    public List<String> getFilteredSpotsNames(String text) throws SpotsNotFoundException {
        var allSpots = this.getAllSpots();

        var spotsNames = allSpots.stream()
                .map(SpotDto::getName)
                .filter(spotName -> spotName.toLowerCase().contains(text.trim().toLowerCase()))
                .toList();

        if (spotsNames.isEmpty()) {
            throw new SpotsNotFoundException("No spot names found!");
        }

        return spotsNames;
    }

}
