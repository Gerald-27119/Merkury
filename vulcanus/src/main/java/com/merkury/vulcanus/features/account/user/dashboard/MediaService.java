package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UnsupportedDateSortTypeException;
import com.merkury.vulcanus.model.dtos.account.media.DatedMediaGroupDto;
import com.merkury.vulcanus.model.entities.spot.SpotMedia;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import com.merkury.vulcanus.model.enums.user.dashboard.DateSortType;
import com.merkury.vulcanus.model.mappers.user.dashboard.MediaMapper;
import com.merkury.vulcanus.model.repositories.SpotMediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MediaService {
    private final SpotMediaRepository spotMediaRepository;

    public List<DatedMediaGroupDto> getSortedUserPhotos(String username, DateSortType type, LocalDate from, LocalDate to) throws UnsupportedDateSortTypeException {
        return getAllUserMedia(username, from, to, GenericMediaType.PHOTO).stream()
                .sorted(getComparator(type))
                .toList();
    }

    public List<DatedMediaGroupDto> getSortedUserMovies(String username, DateSortType type, LocalDate from, LocalDate to) throws UnsupportedDateSortTypeException {
        return getAllUserMedia(username, from, to, GenericMediaType.VIDEO).stream()
                .sorted(getComparator(type))
                .toList();
    }

    private List<DatedMediaGroupDto> getAllUserMedia(String username, LocalDate from, LocalDate to, GenericMediaType type) {
        List<SpotMedia> media;
        if (from == null && to == null) {
            media = spotMediaRepository.findAllByAuthorUsernameAndGenericMediaType(username, type);
        } else if (from != null && to == null) {
            media = spotMediaRepository.findByAuthorUsernameAndGenericMediaTypeAndAddDateGreaterThanEqual(username, type, from);
        } else if (from == null) {
            media = spotMediaRepository.findByAuthorUsernameAndGenericMediaTypeAndAddDateLessThanEqual(username, type, to);
        } else {
            media = spotMediaRepository.findAllByAuthorUsernameAndGenericMediaTypeAndAddDateBetween(username, type, from, to);
        }
        return media.stream()
                .collect(Collectors.groupingBy(
                        SpotMedia::getAddDate,
                        Collectors.mapping(MediaMapper::toDto, Collectors.toList())
                )).entrySet().stream()
                .map(e -> MediaMapper.toDto(e.getKey(), e.getValue()))
                .toList();
    }

    private Comparator<DatedMediaGroupDto> getComparator(DateSortType type) throws UnsupportedDateSortTypeException {
        return switch (type) {
            case DATE_ASCENDING -> Comparator.comparing(DatedMediaGroupDto::date);
            case DATE_DESCENDING -> Comparator.comparing(DatedMediaGroupDto::date).reversed();
            default -> throw new UnsupportedDateSortTypeException(type);
        };
    }
}
