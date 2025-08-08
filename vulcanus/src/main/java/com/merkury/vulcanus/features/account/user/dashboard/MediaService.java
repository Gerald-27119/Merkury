package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UnsupportedDateSortTypeException;
import com.merkury.vulcanus.model.dtos.account.media.DatedMediaGroupDto;
import com.merkury.vulcanus.model.entities.spot.SpotMedia;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import com.merkury.vulcanus.model.enums.user.dashboard.DateSortType;
import com.merkury.vulcanus.model.mappers.user.dashboard.MediaMapper;
import com.merkury.vulcanus.model.repositories.SpotMediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MediaService {
    private final SpotMediaRepository spotMediaRepository;

    public List<DatedMediaGroupDto> getSortedUserPhotos(String username, DateSortType type, LocalDate from, LocalDate to, int page, int size) throws UnsupportedDateSortTypeException {
        return getAllUserMedia(username, from, to, GenericMediaType.PHOTO, type, page, size);
    }

    public List<DatedMediaGroupDto> getSortedUserMovies(String username, DateSortType type, LocalDate from, LocalDate to, int page, int size) throws UnsupportedDateSortTypeException {
        return getAllUserMedia(username, from, to, GenericMediaType.VIDEO, type, page, size);
    }

    private List<DatedMediaGroupDto> getAllUserMedia(String username, LocalDate from, LocalDate to, GenericMediaType type, DateSortType sortType, int page, int size) throws UnsupportedDateSortTypeException {
        Pageable pageable = PageRequest.of(page, size, getSpringSort(sortType));
        Page<SpotMedia> media;

        if (from == null && to == null) {
            media = spotMediaRepository.findAllByAuthorUsernameAndGenericMediaType(username, type, pageable);
        } else if (from != null && to == null) {
            media = spotMediaRepository.findByAuthorUsernameAndGenericMediaTypeAndAddDateGreaterThanEqual(username, type, from, pageable);
        } else if (from == null) {
            media = spotMediaRepository.findByAuthorUsernameAndGenericMediaTypeAndAddDateLessThanEqual(username, type, to, pageable);
        } else {
            media = spotMediaRepository.findAllByAuthorUsernameAndGenericMediaTypeAndAddDateBetween(username, type, from, to, pageable);
        }

        return media.stream()
                .collect(Collectors.groupingBy(
                        SpotMedia::getAddDate,
                        Collectors.mapping(MediaMapper::toDto, Collectors.toList())
                )).entrySet().stream()
                .map(e -> MediaMapper.toDto(e.getKey(), e.getValue()))
                .toList();
    }

    private Sort getSpringSort(DateSortType type) throws UnsupportedDateSortTypeException {
        return switch (type) {
            case DATE_ASCENDING -> Sort.by("addDate").ascending();
            case DATE_DESCENDING -> Sort.by("addDate").descending();
            default -> throw new UnsupportedDateSortTypeException(type);
        };
    }
}
