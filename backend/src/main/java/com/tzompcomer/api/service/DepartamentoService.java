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

    public List<Departamento> findActive() {
        return departamentoRepository.findByActivoTrue();
    }

    public Optional<Departamento> findById(Long id) {
        return departamentoRepository.findById(id);
    }

    @Transactional
    public Departamento save(Departamento departamento) {
        return departamentoRepository.save(departamento);
    }

    @Transactional
    public Departamento update(Long id, Departamento departamentoDetails) {
        return departamentoRepository.findById(id).map(departamento -> {
            if (departamentoDetails.getNombre() != null) {
                departamento.setNombre(departamentoDetails.getNombre());
            }
            if (departamentoDetails.getIdentificadorIcono() != null) {
                departamento.setIdentificadorIcono(departamentoDetails.getIdentificadorIcono());
            }
            if (departamentoDetails.getImagenUrl() != null) {
                departamento.setImagenUrl(departamentoDetails.getImagenUrl());
            }
            if (departamentoDetails.getActivo() != null) {
                departamento.setActivo(departamentoDetails.getActivo());
            }
            return departamentoRepository.save(departamento);
        }).orElse(null);
    }

    @Transactional
    public void deleteById(Long id) {
        departamentoRepository.deleteById(id);
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
