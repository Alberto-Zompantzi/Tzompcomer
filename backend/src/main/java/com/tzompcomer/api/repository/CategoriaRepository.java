package com.tzompcomer.api.repository;

import com.tzompcomer.api.entity.Categoria;
import com.tzompcomer.api.entity.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByActivoTrue();
    List<Categoria> findByDepartamento(Departamento departamento);
    List<Categoria> findByDepartamentoAndActivoTrue(Departamento departamento);
    Optional<Categoria> findByNombre(String nombre);
}
