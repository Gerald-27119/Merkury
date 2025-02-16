package com.merkury.vulcanus.model.embeddable;

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
public class BorderPoint implements Serializable {

    @Serial
    private static final long serialVersionUID = 4868207685462237247L;

    private Double x;
    private Double y;

}
