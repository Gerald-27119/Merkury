package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.photos.PhotosWithDateDto;
import com.merkury.vulcanus.model.entities.Img;
import com.merkury.vulcanus.model.mappers.user.dashboard.PhotosMapper;
import com.merkury.vulcanus.model.repositories.ImgRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhotosService {
    private final ImgRepository imgRepository;

    public List<PhotosWithDateDto> getAllUserPhotos(String username) {
        return imgRepository.findAllByAuthorUsername(username)
                .stream()
                .collect(Collectors.groupingBy(
                        Img::getAddDate,
                        Collectors.mapping(PhotosMapper::toDto, Collectors.toList())
                )).entrySet().stream()
                .map(e -> PhotosMapper.toDto(e.getKey(), e.getValue()))
                .sorted((a, b) -> b.date().compareTo(a.date()))
                .toList();
    }
}
