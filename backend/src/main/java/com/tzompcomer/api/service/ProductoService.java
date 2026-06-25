package com.tzompcomer.api.service;

import com.tzompcomer.api.entity.Categoria;
import com.tzompcomer.api.entity.Producto;
import com.tzompcomer.api.repository.CategoriaRepository;
import com.tzompcomer.api.repository.DepartamentoRepository;
import com.tzompcomer.api.repository.ProductoRepository;
import com.tzompcomer.api.repository.SubcategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final DepartamentoRepository departamentoRepository;
    private final CategoriaRepository categoriaRepository;
    private final SubcategoriaRepository subcategoriaRepository;

    public List<Producto> findAll() {
        return productoRepository.findAll();
    }

    public List<Producto> findAllActive() {
        return productoRepository.findByActivoTrue();
    }

    public List<Producto> findVisible() {
        // Temporal: Devuelve todos los productos activos mientras migramos los datos
        return productoRepository.findByActivoTrue();
        // Después de migrar, volver a usar: return productoRepository.findVisibleProductos();
    }

    @Cacheable(value = "productosCache", key = "'visible-' + #searchTerm + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<Producto> findVisiblePageable(String searchTerm, Pageable pageable) {
        return productoRepository.findVisibleProductos(searchTerm, pageable);
    }

    @Cacheable(value = "productosCache", key = "#departamentoId + '-' + #searchTerm + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<Producto> search(Long departamentoId, String searchTerm, Pageable pageable) {
        return productoRepository.findByDepartamentoIdAndSearchTerm(departamentoId, searchTerm, pageable);
    }

    @Cacheable(value = "productosCache", key = "'subcategoria-' + #subcategoriaId + '-' + #searchTerm + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<Producto> searchBySubcategoria(Long subcategoriaId, String searchTerm, Pageable pageable) {
        return productoRepository.findBySubcategoriaIdAndSearchTerm(subcategoriaId, searchTerm, pageable);
    }

    public List<Producto> searchAll(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return productoRepository.findAll();
        }
        return productoRepository.searchAllProductos(searchTerm);
    }

    public Optional<Producto> findById(Long id) {
        return productoRepository.findById(id);
    }

    public Optional<Producto> findBySku(String sku) {
        return productoRepository.findBySku(sku);
    }

    @Transactional
    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }

    @Transactional
    public Producto update(Long id, Producto productoActualizado) {
        return productoRepository.findById(id).map(existing -> {
            // Actualizar solo campos que vengan con datos
            if (productoActualizado.getNombre() != null) {
                existing.setNombre(productoActualizado.getNombre());
            }
            if (productoActualizado.getPrecio() != null) {
                existing.setPrecio(productoActualizado.getPrecio());
            }
            if (productoActualizado.getDescripcion() != null) {
                existing.setDescripcion(productoActualizado.getDescripcion());
            }
            if (productoActualizado.getImagenUrl() != null) {
                existing.setImagenUrl(productoActualizado.getImagenUrl());
            }
            if (productoActualizado.getSku() != null) {
                existing.setSku(productoActualizado.getSku());
            }
            if (productoActualizado.getCategoria() != null) {
                existing.setCategoria(productoActualizado.getCategoria());
            }
            if (productoActualizado.getDisponible() != null) {
                existing.setDisponible(productoActualizado.getDisponible());
            }
            if (productoActualizado.getActivo() != null) {
                existing.setActivo(productoActualizado.getActivo());
            }
            // Actualizar departamento solo si viene con datos - BUSCAR DE LA BD
            if (productoActualizado.getDepartamento() != null && productoActualizado.getDepartamento().getId() != null) {
                departamentoRepository.findById(productoActualizado.getDepartamento().getId()).ifPresent(existing::setDepartamento);
            }
            // Actualizar categoriaEntity solo si viene con datos - BUSCAR DE LA BD
            if (productoActualizado.getCategoriaEntity() != null && productoActualizado.getCategoriaEntity().getId() != null) {
                categoriaRepository.findById(productoActualizado.getCategoriaEntity().getId()).ifPresent(existing::setCategoriaEntity);
            }
            // Actualizar subcategoria solo si viene con datos - BUSCAR DE LA BD
            if (productoActualizado.getSubcategoria() != null && productoActualizado.getSubcategoria().getId() != null) {
                subcategoriaRepository.findById(productoActualizado.getSubcategoria().getId()).ifPresent(existing::setSubcategoria);
            }
            // Guardar y retornar
            return productoRepository.save(existing);
        }).orElse(null);
    }

    @Transactional
    public void assignToCategoria(List<Long> productoIds, Long categoriaId) {
        Optional<Categoria> categoriaOpt = categoriaRepository.findById(categoriaId);
        if (categoriaOpt.isEmpty()) {
            return;
        }
        Categoria categoria = categoriaOpt.get();
        for (Long productoId : productoIds) {
            productoRepository.findById(productoId).ifPresent(producto -> {
                producto.setCategoriaEntity(categoria);
                productoRepository.save(producto);
            });
        }
    }

    @Transactional
    public void softDeleteById(Long id) {
        productoRepository.findById(id).ifPresent(producto -> {
            producto.setActivo(false);
            productoRepository.save(producto);
        });
    }

    @Transactional
    public void deleteById(Long id) {
        productoRepository.deleteById(id);
    }

    @CacheEvict(value = "productosCache", allEntries = true)
    public void clearCache() {
        // Este método limpia toda la caché de productos
    }
}
