package com.tzompcomer.api.service;

import com.tzompcomer.api.entity.Subcategoria;
import com.tzompcomer.api.repository.SubcategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubcategoriaService {

    private final SubcategoriaRepository subcategoriaRepository;

    public List<Subcategoria> findAll() {
        return subcategoriaRepository.findAll();
    }

    public List<Subcategoria> findByCategoriaId(Long categoriaId) {
        return subcategoriaRepository.findByCategoriaId(categoriaId);
    }

    public Optional<Subcategoria> findById(Long id) {
        return subcategoriaRepository.findById(id);
    }

    @Transactional
    public Subcategoria save(Subcategoria subcategoria) {
        return subcategoriaRepository.save(subcategoria);
    }

    @Transactional
    public void deleteById(Long id) {
        subcategoriaRepository.deleteById(id);
    }
}
