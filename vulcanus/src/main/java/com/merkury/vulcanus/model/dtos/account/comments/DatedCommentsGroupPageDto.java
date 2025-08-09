package com.merkury.vulcanus.model.dtos.account.comments;

import java.util.List;

public record DatedCommentsGroupPageDto(List<DatedCommentsGroupDto> items, boolean hasNext) {
}
