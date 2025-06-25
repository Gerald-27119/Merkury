package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UnsupportedPhotoSortTypeException;
import com.merkury.vulcanus.model.dtos.account.photos.DatedPhotosGroupDto;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.enums.user.dashboard.PhotoSortType;
import com.merkury.vulcanus.model.mappers.user.dashboard.PhotosMapper;
import com.merkury.vulcanus.model.repositories.ImgRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhotosService {
    private final ImgRepository imgRepository;

    public List<DatedPhotosGroupDto> getSortedUserPhotos(String username, PhotoSortType type, LocalDate from, LocalDate to) throws UnsupportedPhotoSortTypeException {
        return getAllUserPhotos(username, from, to).stream()
                .sorted(getComparator(type))
                .toList();
    }

    private List<DatedPhotosGroupDto> getAllUserPhotos(String username, LocalDate from, LocalDate to) {
        return imgRepository.findAllByAuthorUsername(username)
                .stream()
                .filter(i -> isInDateRange(i.getAddDate(), from, to))
                .collect(Collectors.groupingBy(
                        Img::getAddDate,
                        Collectors.mapping(PhotosMapper::toDto, Collectors.toList())
                )).entrySet().stream()
                .map(e -> PhotosMapper.toDto(e.getKey(), e.getValue()))
                .toList();
    }

    private boolean isInDateRange(LocalDate date, LocalDate from, LocalDate to) {
        return (from == null || !date.isBefore(from)) && (to == null || !date.isAfter(to));
    }

    private Comparator<DatedPhotosGroupDto> getComparator(PhotoSortType type) throws UnsupportedPhotoSortTypeException {
        return switch (type) {
            case DATE_INCREASE -> Comparator.comparing(DatedPhotosGroupDto::date).reversed();
            case DATE_DECREASE -> Comparator.comparing(DatedPhotosGroupDto::date);
            default -> throw new UnsupportedPhotoSortTypeException(type);
        };
    }
}
