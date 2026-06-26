package com.tzompcomer.api.repository;

import com.tzompcomer.api.entity.Categoria;
import com.tzompcomer.api.entity.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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
           "p.categoriaEntity.macrocategoria IS NOT NULL AND " +
           "p.categoriaEntity.macrocategoria.activo = true")
    List<Producto> findVisibleProductos();

    @Query("SELECT p FROM Producto p WHERE " +
           "p.activo = true AND " +
           "p.categoriaEntity IS NOT NULL AND " +
           "p.categoriaEntity.activo = true AND " +
           "p.categoriaEntity.macrocategoria IS NOT NULL AND " +
           "p.categoriaEntity.macrocategoria.activo = true AND " +
           "(:searchTerm IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Producto> findVisibleProductos(@Param("searchTerm") String searchTerm, Pageable pageable);

    List<Producto> findByCategoriaEntity(Categoria categoria);

    @Query("SELECT p FROM Producto p WHERE " +
           "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Producto> searchAllProductos(@Param("searchTerm") String searchTerm);

    @Query("SELECT p FROM Producto p WHERE " +
           "p.activo = true AND " +
           "(:macrocategoriaId IS NULL OR p.categoriaEntity.macrocategoria.id = :macrocategoriaId) AND " +
           "(:searchTerm IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Producto> findByMacrocategoriaIdAndSearchTerm(
            @Param("macrocategoriaId") Long macrocategoriaId, 
            @Param("searchTerm") String searchTerm, 
            Pageable pageable);

    // NUEVOS MÉTODOS PARA LA ASIGNACIÓN MASIVA
    @Query("SELECT DISTINCT p.categoria FROM Producto p WHERE p.categoria IS NOT NULL AND p.categoria <> '' ORDER BY p.categoria")
    List<String> findDistinctExcelCategorias();

    List<Producto> findByCategoria(String excelCategoria);

    @Modifying
    @Transactional
    @Query("UPDATE Producto p SET p.categoriaEntity = :categoria WHERE p.categoria = :excelCategoria")
    void assignExcelCategoriaToCategoria(@Param("excelCategoria") String excelCategoria, @Param("categoria") Categoria categoria);
}
