package com.merkury.vulcanus.model.dtos.account.add.spot;

import com.merkury.vulcanus.model.embeddable.BorderPoint;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Builder(toBuilder = true)
public record SpotToAddDto(Long id,
                           String name,
                           String description,
                           String country,
                           String region,
                           String city,
                           String street,
                           List<BorderPoint> borderPoints,
                           List<MultipartFile> media) {
}
