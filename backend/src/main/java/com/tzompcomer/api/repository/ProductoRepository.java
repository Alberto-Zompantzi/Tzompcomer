package com.tzompcomer.api.repository;

import com.tzompcomer.api.entity.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    Optional<Producto> findBySku(String sku);

    @Query("SELECT p FROM Producto p WHERE " +
           "(:departamentoId IS NULL OR p.departamento.id = :departamentoId) AND " +
           "(:searchTerm IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Producto> findByDepartamentoIdAndSearchTerm(
            @Param("departamentoId") Long departamentoId, 
            @Param("searchTerm") String searchTerm, 
            Pageable pageable);
}
