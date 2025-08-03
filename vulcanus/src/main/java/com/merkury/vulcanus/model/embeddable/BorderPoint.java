package com.merkury.vulcanus.model.embeddable;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;


@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
//@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "@class")
public class BorderPoint implements Serializable {
    @Serial
    private static final long serialVersionUID = 4868207685462237247L;
    private Double x;
    private Double y;
}
