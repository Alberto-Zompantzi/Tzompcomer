package com.tzompcomer.api.repository;

import com.tzompcomer.api.entity.Categoria;
import com.tzompcomer.api.entity.Macrocategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByActivoTrue();
    List<Categoria> findByMacrocategoria(Macrocategoria macrocategoria);
    List<Categoria> findByMacrocategoriaAndActivoTrue(Macrocategoria macrocategoria);
    Optional<Categoria> findByNombre(String nombre);
}
