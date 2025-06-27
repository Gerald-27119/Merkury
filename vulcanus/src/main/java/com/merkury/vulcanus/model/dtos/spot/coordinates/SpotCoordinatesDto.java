package com.merkury.vulcanus.model.dtos.spot.coordinates;

import jakarta.validation.constraints.*;

public record SpotCoordinatesDto(@NotNull(message = "Longitude cannot be null.")
                                     @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180.")
                                     @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180.")
                                     Double x,

                                 @NotNull(message = "Latitude cannot be null.")
                                     @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90.")
                                     @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90.")
                                     Double y) {
}
