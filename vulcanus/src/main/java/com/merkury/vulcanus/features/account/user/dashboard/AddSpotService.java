package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.model.dtos.account.add.spot.AddSpotPageDto;
import com.merkury.vulcanus.model.entities.spot.Spot;
import com.merkury.vulcanus.model.mappers.user.dashboard.AddSpotMapper;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AddSpotService {
    private final SpotRepository spotRepository;

    public AddSpotPageDto getAllSpotsAddedByUser(String username, int page, int size)   {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Slice<Spot> spots = spotRepository.findByAuthorUsername(username, pageable);

        var mappedSpots = spots.stream().map(AddSpotMapper::toDto).toList();
        return new AddSpotPageDto(mappedSpots, spots.hasNext());
    }

    public void addSpot(){

    }
}
