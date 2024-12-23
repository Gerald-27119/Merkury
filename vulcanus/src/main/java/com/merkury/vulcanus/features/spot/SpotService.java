package com.merkury.vulcanus.features.spot;

import com.merkury.vulcanus.model.dtos.SpotDto;
import com.merkury.vulcanus.model.mappers.SpotMapper;
import com.merkury.vulcanus.model.repositories.SpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotService {

    private final SpotRepository spotRepository;

    public List<SpotDto> getAllSpots() {
        return spotRepository.findAll().stream().map(SpotMapper::toDto).toList();
    }

    public SpotDto getSpotById(Long id) {
        return spotRepository.findById(id).map(SpotMapper::toDto).orElseThrow(RuntimeException::new);
    }
}
