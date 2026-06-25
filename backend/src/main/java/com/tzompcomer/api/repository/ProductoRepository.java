package com.tzompcomer.api.repository;

import com.tzompcomer.api.entity.Categoria;
import com.tzompcomer.api.entity.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    Optional<Producto> findBySku(String sku);

    List<Producto> findByActivoTrue();

    @Query("SELECT p FROM Producto p WHERE " +
           "p.activo = true AND " +
           "p.categoriaEntity IS NOT NULL AND " +
           "p.categoriaEntity.activo = true AND " +
           "p.categoriaEntity.departamento IS NOT NULL AND " +
           "p.categoriaEntity.departamento.activo = true")
    List<Producto> findVisibleProductos();

    @Query("SELECT p FROM Producto p WHERE " +
           "p.activo = true AND " +
           "p.categoriaEntity IS NOT NULL AND " +
           "p.categoriaEntity.activo = true AND " +
           "p.categoriaEntity.departamento IS NOT NULL AND " +
           "p.categoriaEntity.departamento.activo = true AND " +
           "(:searchTerm IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Producto> findVisibleProductos(@Param("searchTerm") String searchTerm, Pageable pageable);

    List<Producto> findByCategoriaEntity(Categoria categoria);

    @Query("SELECT p FROM Producto p WHERE " +
           "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Producto> searchAllProductos(@Param("searchTerm") String searchTerm);

    @Query("SELECT p FROM Producto p WHERE " +
           "p.activo = true AND " +
           "(:departamentoId IS NULL OR p.departamento.id = :departamentoId) AND " +
           "(:searchTerm IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Producto> findByDepartamentoIdAndSearchTerm(
            @Param("departamentoId") Long departamentoId, 
            @Param("searchTerm") String searchTerm, 
            Pageable pageable);

    @Query("SELECT p FROM Producto p WHERE " +
           "p.activo = true AND " +
           "(:subcategoriaId IS NULL OR p.subcategoria.id = :subcategoriaId) AND " +
           "(:searchTerm IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Producto> findBySubcategoriaIdAndSearchTerm(
            @Param("subcategoriaId") Long subcategoriaId, 
            @Param("searchTerm") String searchTerm, 
            Pageable pageable);
}
