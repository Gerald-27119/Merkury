package com.merkury.vulcanus.model.dtos;

import java.util.Collection;

public record SimpleSliceDto<T>(boolean hasNext, Collection<T> collection) {

}
