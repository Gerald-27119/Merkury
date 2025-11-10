package com.merkury.vulcanus.model.dtos.forum;

import com.merkury.vulcanus.model.enums.forum.ForumReportReason;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record ForumReportDto(@NotNull(message = "Reason cannot be empty.")
                             ForumReportReason reason,
                             @NotBlank(message = "Details cannot be empty.")
                             @Size(min = 3, max = 1000, message = "Details must be from 3 to 1000 characters")
                             String details) {
}
