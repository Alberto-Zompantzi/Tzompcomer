package com.tzompcomer.api.config;

import com.tzompcomer.api.entity.Departamento;
import com.tzompcomer.api.entity.Producto;
import com.tzompcomer.api.repository.DepartamentoRepository;
import com.tzompcomer.api.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DepartamentoRepository departamentoRepository;
    private final ProductoRepository productoRepository;

    public DataInitializer(DepartamentoRepository departamentoRepository, ProductoRepository productoRepository) {
        this.departamentoRepository = departamentoRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (departamentoRepository.count() == 0) {
            // Crear departamentos
            Departamento electronica = new Departamento();
            electronica.setNombre("Electrónica");
            electronica.setIdentificadorIcono("electronics");
            electronica = departamentoRepository.save(electronica);

            Departamento ropa = new Departamento();
            ropa.setNombre("Ropa y Calzado");
            ropa.setIdentificadorIcono("clothing");
            ropa = departamentoRepository.save(ropa);

            Departamento hogar = new Departamento();
            hogar.setNombre("Hogar y Decoración");
            hogar.setIdentificadorIcono("home");
            hogar = departamentoRepository.save(hogar);

            Departamento deportes = new Departamento();
            deportes.setNombre("Deportes y Fitness");
            deportes.setIdentificadorIcono("sports");
            deportes = departamentoRepository.save(deportes);

            Departamento juguetes = new Departamento();
            juguetes.setNombre("Juguetes y Juegos");
            juguetes.setIdentificadorIcono("toys");
            juguetes = departamentoRepository.save(juguetes);

            Departamento belleza = new Departamento();
            belleza.setNombre("Belleza y Cuidado");
            belleza.setIdentificadorIcono("beauty");
            belleza = departamentoRepository.save(belleza);

            // Crear productos
            Producto p1 = new Producto();
            p1.setSku("PROD-001");
            p1.setNombre("Smartphone Premium 15 Pro Max 256GB Azul");
            p1.setDescripcion("Teléfono inteligente de última generación");
            p1.setPrecio(new BigDecimal("21999.00"));
            p1.setDepartamento(electronica);
            p1.setCategoria("Celulares");
            p1.setDisponible(true);
            productoRepository.save(p1);

            Producto p2 = new Producto();
            p2.setSku("PROD-002");
            p2.setNombre("Camiseta Premium de Algodón 100% - Negro");
            p2.setDescripcion("Camiseta de algodón 100% premium");
            p2.setPrecio(new BigDecimal("499.00"));
            p2.setDepartamento(ropa);
            p2.setCategoria("Camisetas");
            p2.setDisponible(true);
            productoRepository.save(p2);

            Producto p3 = new Producto();
            p3.setSku("PROD-003");
            p3.setNombre("Silla Ergonómica de Oficina Pro");
            p3.setDescripcion("Silla ergonómica ajustable premium");
            p3.setPrecio(new BigDecimal("8499.00"));
            p3.setDepartamento(hogar);
            p3.setCategoria("Muebles");
            p3.setDisponible(true);
            productoRepository.save(p3);

            Producto p4 = new Producto();
            p4.setSku("PROD-004");
            p4.setNombre("Balón de Fútbol Oficial Match");
            p4.setDescripcion("Balón oficial de la liga profesional");
            p4.setPrecio(new BigDecimal("1299.00"));
            p4.setDepartamento(deportes);
            p4.setCategoria("Fútbol");
            p4.setDisponible(true);
            productoRepository.save(p4);

            Producto p5 = new Producto();
            p5.setSku("PROD-005");
            p5.setNombre("Laptop Pro 16\" M3 Max 64GB RAM");
            p5.setDescripcion("Laptop para profesionales de alto rendimiento");
            p5.setPrecio(new BigDecimal("68999.00"));
            p5.setDepartamento(electronica);
            p5.setCategoria("Computadoras");
            p5.setDisponible(true);
            productoRepository.save(p5);

            Producto p6 = new Producto();
            p6.setSku("PROD-006");
            p6.setNombre("Jeans Slim Fit Premium - Azul Oscuro");
            p6.setDescripcion("Jeans clásico de alta calidad");
            p6.setPrecio(new BigDecimal("999.00"));
            p6.setDepartamento(ropa);
            p6.setCategoria("Pantalones");
            p6.setDisponible(true);
            productoRepository.save(p6);

            Producto p7 = new Producto();
            p7.setSku("PROD-007");
            p7.setNombre("Mesa de Centro de Madera Maciza");
            p7.setDescripcion("Mesa de madera para sala de estar");
            p7.setPrecio(new BigDecimal("12999.00"));
            p7.setDepartamento(hogar);
            p7.setCategoria("Muebles");
            p7.setDisponible(true);
            productoRepository.save(p7);

            Producto p8 = new Producto();
            p8.setSku("PROD-008");
            p8.setNombre("Raqueta de Tenis Profesional Tour");
            p8.setDescripcion("Raqueta profesional de competición");
            p8.setPrecio(new BigDecimal("4999.00"));
            p8.setDepartamento(deportes);
            p8.setCategoria("Tenis");
            p8.setDisponible(true);
            productoRepository.save(p8);

            Producto p9 = new Producto();
            p9.setSku("PROD-009");
            p9.setNombre("Audífonos Inalámbricos Pro Max ANC");
            p9.setDescripcion("Audífonos con cancelación de ruido activa");
            p9.setPrecio(new BigDecimal("6499.00"));
            p9.setDepartamento(electronica);
            p9.setCategoria("Audio");
            p9.setDisponible(true);
            productoRepository.save(p9);

            Producto p10 = new Producto();
            p10.setSku("PROD-010");
            p10.setNombre("Set de Cuidado Facial Premium");
            p10.setDescripcion("Kit completo de cuidado de la piel");
            p10.setPrecio(new BigDecimal("2499.00"));
            p10.setDepartamento(belleza);
            p10.setCategoria("Cuidado Facial");
            p10.setDisponible(true);
            productoRepository.save(p10);

            System.out.println("✅ Datos inicializados correctamente!");
        }
    }
}
