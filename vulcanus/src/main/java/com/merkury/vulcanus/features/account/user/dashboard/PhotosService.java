package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UnsupportedPhotoSortTypeException;
import com.merkury.vulcanus.model.dtos.account.photos.PhotosWithDateDto;
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

    public List<PhotosWithDateDto> getSortedUserPhotos(String username, PhotoSortType type, LocalDate from, LocalDate to) throws UnsupportedPhotoSortTypeException {
        var photos = getAllUserPhotos(username)
                .stream()
                .filter(p -> (p.date().isAfter(from) || p.date().isEqual(from)) && (p.date().isBefore(to) || p.date().isEqual(to)));

        switch (type) {
            case DATE_INCREASE -> {
                return photos.sorted((a, b) -> b.date().compareTo(a.date())).toList();
            }
            case DATE_DECREASE -> {
                return photos.sorted(Comparator.comparing(PhotosWithDateDto::date)).toList();
            }
//            case VIEWS_INCREASE -> {
//                return photos.sorted((a, b) -> b.date().compareTo(a.date())).toList();
//            };
//            case VIEWS_DECREASE -> {
//                return photos.sorted(Comparator.comparing(PhotosWithDateDto::)).toList();
//            };
//            case HEARTS_INCREASE -> {
//                return photos.sorted((a, b) -> b.date().compareTo(a.date())).toList();
//            };
//            case HEARTS_DECREASE -> {
//                return photos.sorted(Comparator.comparing(PhotosWithDateDto::date)).toList();
//            };
            default -> throw new UnsupportedPhotoSortTypeException(type);
        }
    }

    private List<PhotosWithDateDto> getAllUserPhotos(String username) {
        return imgRepository.findAllByAuthorUsername(username)
                .stream()
                .collect(Collectors.groupingBy(
                        Img::getAddDate,
                        Collectors.mapping(PhotosMapper::toDto, Collectors.toList())
                )).entrySet().stream()
                .map(e -> PhotosMapper.toDto(e.getKey(), e.getValue()))
                .toList();
    }
}
