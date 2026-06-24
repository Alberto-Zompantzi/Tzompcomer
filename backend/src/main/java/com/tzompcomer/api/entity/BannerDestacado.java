package com.tzompcomer.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "banner_destacados")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BannerDestacado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "imagen_url", columnDefinition = "TEXT", nullable = false)
    private String imagenUrl;
}
