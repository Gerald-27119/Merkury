package com.merkury.vulcanus.features.account.user.dashboard;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.add.spot.AddSpotPageDto;
import com.merkury.vulcanus.model.dtos.account.add.spot.SpotToAddDto;
import com.merkury.vulcanus.model.embeddable.BorderPoint;
import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.entities.spot.SpotMedia;
import com.merkury.vulcanus.model.enums.GenericMediaType;
import com.merkury.vulcanus.model.mappers.user.dashboard.AddSpotMapper;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import com.merkury.vulcanus.utils.PolygonAreaCalculator;
import com.merkury.vulcanus.utils.PolygonCenterPointCalculator;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AddSpotService {
    private final SpotRepository spotRepository;
    private final UserEntityFetcher userEntityFetcher;

    public AddSpotPageDto getAllSpotsAddedByUser(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Slice<Spot> spots = spotRepository.findByAuthorUsername(username, pageable);

        var mappedSpots = spots.stream().map(AddSpotMapper::toDto).toList();
        return new AddSpotPageDto(mappedSpots, spots.hasNext());
    }

    public void addSpot(String username, String spotJson, List<MultipartFile> mediaFiles) throws UserNotFoundByUsernameException, IOException {
        var mapper = new ObjectMapper();
        var spot = mapper.readValue(spotJson, SpotToAddDto.class);

        var author = userEntityFetcher.getByUsername(username);
        var centerPoint = PolygonCenterPointCalculator.calculateCenterPoint(spot.borderPoints());
        var area = PolygonAreaCalculator.calculateArea(spot.borderPoints().toArray(new BorderPoint[0]));

        var mappedSpot = AddSpotMapper.toEntity(spot);
        mappedSpot.setAuthor(author);
        mappedSpot.setCenterPoint(centerPoint);
        mappedSpot.setArea(area);

        List<SpotMedia> mediaEntities = new ArrayList<>();
        if (mediaFiles != null) {
            for (MultipartFile file : mediaFiles) {
                String filename = saveFile(file);
                SpotMedia mediaEntity = SpotMedia.builder()
                        .url(filename)
                        .alt(file.getOriginalFilename())
                        .description("")
                        .genericMediaType(getMediaType(file))
                        .author(author)
                        .spot(mappedSpot)
                        .build();
                mediaEntities.add(mediaEntity);
            }
        }

        mappedSpot.setMedia(mediaEntities);

        spotRepository.save(mappedSpot);
    }

    private String saveFile(MultipartFile file) throws IOException {
        Path folder = Paths.get("uploads");
        Files.createDirectories(folder);
        Path filePath = folder.resolve(UUID.randomUUID() + "_" + file.getOriginalFilename());
        file.transferTo(filePath);
        return filePath.toString();
    }

    private GenericMediaType getMediaType(MultipartFile file) {
        if (Objects.requireNonNull(file.getContentType()).startsWith("image")) return GenericMediaType.PHOTO;
        return GenericMediaType.VIDEO;
    }
}
