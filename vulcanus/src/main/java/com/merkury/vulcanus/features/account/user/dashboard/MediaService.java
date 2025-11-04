package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UnsupportedDateSortTypeException;
import com.merkury.vulcanus.exception.exceptions.UserIdByUsernameNotFoundException;
import com.merkury.vulcanus.model.dtos.account.media.DatedMediaGroupDto;
import com.merkury.vulcanus.model.dtos.account.media.DatedMediaGroupPageDto;
import com.merkury.vulcanus.model.entities.spot.SpotMedia;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import com.merkury.vulcanus.model.enums.user.dashboard.DateSortType;
import com.merkury.vulcanus.model.mappers.user.dashboard.MediaMapper;
import com.merkury.vulcanus.model.repositories.SpotMediaRepository;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MediaService {
    private final SpotMediaRepository spotMediaRepository;
    private final UserEntityRepository userEntityRepository;

    public DatedMediaGroupPageDto getAllUserPhotos(String username, int page, int size) throws UnsupportedDateSortTypeException {
        return getAllUserMedia(username, null, null, GenericMediaType.PHOTO, DateSortType.DATE_ASCENDING, page, size);
    }

    public DatedMediaGroupPageDto getSortedUserPhotos(String username, DateSortType type, LocalDate from, LocalDate to, int page, int size) throws UnsupportedDateSortTypeException {
        return getAllUserMedia(username, from, to, GenericMediaType.PHOTO, type, page, size);
    }

    public DatedMediaGroupPageDto getSortedUserMovies(String username, DateSortType type, LocalDate from, LocalDate to, int page, int size) throws UnsupportedDateSortTypeException {
        return getAllUserMedia(username, from, to, GenericMediaType.VIDEO, type, page, size);
    }

    public boolean checkIsSpotMediaLikedByUser(long spotMediaId, String username) throws UserIdByUsernameNotFoundException {
        var userId = userEntityRepository.findByUsername(username).orElseThrow(() -> new UserIdByUsernameNotFoundException(username)).getId();
        return spotMediaRepository.existsByIdAndLikedBy_Id(spotMediaId, userId);
    }

    public void addSpotMediaToLiked(String username, long spotMediaId) {
        //TODO
    }

    public void removeSpotMediaFromLiked(String username, long spotMediaId) {
        //TODO
    }

    private DatedMediaGroupPageDto getAllUserMedia(String username, LocalDate from, LocalDate to, GenericMediaType type, DateSortType sortType, int page, int size) throws UnsupportedDateSortTypeException {
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

        var dateComparator = getLocalDateComparator(sortType);

        var mappedMedia = media.stream()
                .collect(Collectors.groupingBy(
                        SpotMedia::getAddDate,
                        Collectors.mapping(MediaMapper::toDto, Collectors.toList())
                )).entrySet().stream()
                .sorted(Map.Entry.comparingByKey(dateComparator))
                .map(e -> MediaMapper.toDto(e.getKey(), e.getValue()))
                .toList();

        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, mappedMedia.size());
        List<DatedMediaGroupDto> paged = fromIndex < mappedMedia.size() ? mappedMedia.subList(fromIndex, toIndex) : List.of();

        boolean hasNext = toIndex < mappedMedia.size();

        return new DatedMediaGroupPageDto(paged, hasNext);
    }

    private Comparator<LocalDate> getLocalDateComparator(DateSortType type) throws UnsupportedDateSortTypeException {
        return switch (type) {
            case DATE_ASCENDING -> Comparator.naturalOrder();
            case DATE_DESCENDING -> Comparator.reverseOrder();
            default -> throw new UnsupportedDateSortTypeException(type);
        };
    }
}
