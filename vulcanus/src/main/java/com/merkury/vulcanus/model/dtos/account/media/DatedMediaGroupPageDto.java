package com.merkury.vulcanus.model.dtos.account.media;

import java.util.List;

public record DatedMediaGroupPageDto(List<DatedMediaGroupDto> items,
                                     boolean hasNext) {
}
