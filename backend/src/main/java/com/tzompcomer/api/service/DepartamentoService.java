package com.tzompcomer.api.service;

import com.tzompcomer.api.entity.Departamento;
import com.tzompcomer.api.repository.DepartamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DepartamentoService {

    private final DepartamentoRepository departamentoRepository;

    public List<Departamento> findAll() {
        return departamentoRepository.findAll();
    }

    public Optional<Departamento> findById(Long id) {
        return departamentoRepository.findById(id);
    }

    @Transactional
    public Departamento save(Departamento departamento) {
        return departamentoRepository.save(departamento);
    }

    @Transactional
    public Departamento getOrCreateByName(String nombre) {
        return departamentoRepository.findByNombre(nombre)
                .orElseGet(() -> departamentoRepository.save(
                        Departamento.builder()
                                .nombre(nombre)
                                .build()
                ));
    }
}
