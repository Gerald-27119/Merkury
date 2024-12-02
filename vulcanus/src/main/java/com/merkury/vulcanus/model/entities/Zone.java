package com.merkury.vulcanus.model.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a zone restricted by law.
 */
@Entity(name = "zones")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Zone extends Area {

    private Integer AGL;
    private Integer AMSL;
    @Id
    private Long id;


}
