package com.merkury.vulcanus.model.dtos.spot;

import com.merkury.vulcanus.model.dtos.ImgDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavouriteSpotDto {
    @Positive
    private Long id;
    @NotBlank
    private String name;
    @NotEmpty
    private List<ImgDto> photos;
}