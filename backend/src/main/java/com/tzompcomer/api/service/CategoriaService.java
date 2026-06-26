package com.tzompcomer.api.service;

import com.tzompcomer.api.entity.Categoria;
import com.tzompcomer.api.entity.Macrocategoria;
import com.tzompcomer.api.repository.CategoriaRepository;
import com.tzompcomer.api.repository.MacrocategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final MacrocategoriaRepository macrocategoriaRepository;

    public List<Categoria> findAll() {
        return categoriaRepository.findAll().stream()
                .sorted((a, b) -> Integer.compare(
                        a.getOrden() != null ? a.getOrden() : 0,
                        b.getOrden() != null ? b.getOrden() : 0))
                .toList();
    }

    public List<Categoria> findActive() {
        return categoriaRepository.findByActivoTrue();
    }

    public List<Categoria> findByMacrocategoria(Long macrocategoriaId) {
        return macrocategoriaRepository.findById(macrocategoriaId)
                .map(categoriaRepository::findByMacrocategoria)
                .orElse(List.of());
    }

    public List<Categoria> findActiveByMacrocategoria(Long macrocategoriaId) {
        return macrocategoriaRepository.findById(macrocategoriaId)
                .map(categoriaRepository::findByMacrocategoriaAndActivoTrue)
                .orElse(List.of());
    }

    public Optional<Categoria> findById(Long id) {
        return categoriaRepository.findById(id);
    }

    @Transactional
    public Categoria save(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    @Transactional
    public Categoria update(Long id, Categoria categoriaDetails) {
        return categoriaRepository.findById(id).map(categoria -> {
            if (categoriaDetails.getNombre() != null) {
                categoria.setNombre(categoriaDetails.getNombre());
            }
            if (categoriaDetails.getImagenUrl() != null) {
                categoria.setImagenUrl(categoriaDetails.getImagenUrl());
            }
            if (categoriaDetails.getActivo() != null) {
                categoria.setActivo(categoriaDetails.getActivo());
            }
            if (categoriaDetails.getMacrocategoria() != null && categoriaDetails.getMacrocategoria().getId() != null) {
                macrocategoriaRepository.findById(categoriaDetails.getMacrocategoria().getId())
                        .ifPresent(categoria::setMacrocategoria);
            }
            return categoriaRepository.save(categoria);
        }).orElse(null);
    }

    @Transactional
    public void deleteById(Long id) {
        categoriaRepository.deleteById(id);
    }

    @Transactional
    public Categoria getOrCreateByName(String nombre, Long macrocategoriaId) {
        Optional<Categoria> existing = categoriaRepository.findByNombre(nombre);
        if (existing.isPresent()) {
            return existing.get();
        }
        Categoria.CategoriaBuilder builder = Categoria.builder().nombre(nombre);
        if (macrocategoriaId != null) {
            macrocategoriaRepository.findById(macrocategoriaId).ifPresent(builder::macrocategoria);
        }
        return categoriaRepository.save(builder.build());
    }
}
