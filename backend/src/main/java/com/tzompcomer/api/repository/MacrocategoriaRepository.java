package com.tzompcomer.api.repository;

import com.tzompcomer.api.entity.Macrocategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MacrocategoriaRepository extends JpaRepository<Macrocategoria, Long> {
    Optional<Macrocategoria> findByNombre(String nombre);
    List<Macrocategoria> findByActivoTrue();
    List<Macrocategoria> findAllByOrderByOrdenAsc();
}
