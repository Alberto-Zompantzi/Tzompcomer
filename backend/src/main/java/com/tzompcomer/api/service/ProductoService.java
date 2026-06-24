package com.tzompcomer.api.service;

import com.tzompcomer.api.entity.Producto;
import com.tzompcomer.api.repository.ProductoRepository;
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

    public List<Producto> findAll() {
        return productoRepository.findByActivoTrue();
    }

    @Cacheable(value = "productosCache", key = "#departamentoId + '-' + #searchTerm + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<Producto> search(Long departamentoId, String searchTerm, Pageable pageable) {
        return productoRepository.findByDepartamentoIdAndSearchTerm(departamentoId, searchTerm, pageable);
    }

    @Cacheable(value = "productosCache", key = "'subcategoria-' + #subcategoriaId + '-' + #searchTerm + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<Producto> searchBySubcategoria(Long subcategoriaId, String searchTerm, Pageable pageable) {
        return productoRepository.findBySubcategoriaIdAndSearchTerm(subcategoriaId, searchTerm, pageable);
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
