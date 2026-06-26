package com.tzompcomer.api.service;

import com.tzompcomer.api.entity.Macrocategoria;
import com.tzompcomer.api.repository.MacrocategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MacrocategoriaService {

    private final MacrocategoriaRepository macrocategoriaRepository;

    public List<Macrocategoria> findAll() {
        return macrocategoriaRepository.findAll();
    }

    public List<Macrocategoria> findActive() {
        return macrocategoriaRepository.findByActivoTrue();
    }

    public Optional<Macrocategoria> findById(Long id) {
        return macrocategoriaRepository.findById(id);
    }

    @Transactional
    public Macrocategoria save(Macrocategoria macrocategoria) {
        return macrocategoriaRepository.save(macrocategoria);
    }

    @Transactional
    public Macrocategoria update(Long id, Macrocategoria macrocategoriaDetails) {
        return macrocategoriaRepository.findById(id).map(macrocategoria -> {
            if (macrocategoriaDetails.getNombre() != null) {
                macrocategoria.setNombre(macrocategoriaDetails.getNombre());
            }
            if (macrocategoriaDetails.getImagenUrl() != null) {
                macrocategoria.setImagenUrl(macrocategoriaDetails.getImagenUrl());
            }
            if (macrocategoriaDetails.getActivo() != null) {
                macrocategoria.setActivo(macrocategoriaDetails.getActivo());
            }
            return macrocategoriaRepository.save(macrocategoria);
        }).orElse(null);
    }

    @Transactional
    public void deleteById(Long id) {
        macrocategoriaRepository.deleteById(id);
    }

    @Transactional
    public Macrocategoria getOrCreateByName(String nombre) {
        return macrocategoriaRepository.findByNombre(nombre)
                .orElseGet(() -> macrocategoriaRepository.save(
                        Macrocategoria.builder()
                                .nombre(nombre)
                                .build()
                ));
    }
}
