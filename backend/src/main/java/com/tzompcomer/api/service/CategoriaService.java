package com.tzompcomer.api.service;

import com.tzompcomer.api.entity.Categoria;
import com.tzompcomer.api.entity.Departamento;
import com.tzompcomer.api.repository.CategoriaRepository;
import com.tzompcomer.api.repository.DepartamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final DepartamentoRepository departamentoRepository;

    public List<Categoria> findAll() {
        return categoriaRepository.findAll();
    }

    public List<Categoria> findActive() {
        return categoriaRepository.findByActivoTrue();
    }

    public List<Categoria> findByDepartamento(Long departamentoId) {
        return departamentoRepository.findById(departamentoId)
                .map(categoriaRepository::findByDepartamento)
                .orElse(List.of());
    }

    public List<Categoria> findActiveByDepartamento(Long departamentoId) {
        return departamentoRepository.findById(departamentoId)
                .map(categoriaRepository::findByDepartamentoAndActivoTrue)
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
            if (categoriaDetails.getDepartamento() != null && categoriaDetails.getDepartamento().getId() != null) {
                departamentoRepository.findById(categoriaDetails.getDepartamento().getId())
                        .ifPresent(categoria::setDepartamento);
            }
            return categoriaRepository.save(categoria);
        }).orElse(null);
    }

    @Transactional
    public void deleteById(Long id) {
        categoriaRepository.deleteById(id);
    }

    @Transactional
    public Categoria getOrCreateByName(String nombre, Long departamentoId) {
        Optional<Categoria> existing = categoriaRepository.findByNombre(nombre);
        if (existing.isPresent()) {
            return existing.get();
        }
        Categoria.CategoriaBuilder builder = Categoria.builder().nombre(nombre);
        if (departamentoId != null) {
            departamentoRepository.findById(departamentoId).ifPresent(builder::departamento);
        }
        return categoriaRepository.save(builder.build());
    }
}
