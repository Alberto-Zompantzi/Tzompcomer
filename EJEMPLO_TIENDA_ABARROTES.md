# 🛒 EJEMPLO COMPLETO: TIENDA DE ABARROTES "SUPER PRECIOS"
# ================================================
# Este es un ejemplo completo de cómo personalizar TODO el proyecto para una tienda de abarrotes

# ================================================
# 1. MODIFICAR DataInitializer.java
# ================================================
# Archivo: backend/src/main/java/com/tzompcomer/api/config/DataInitializer.java

package com.tzompcomer.api.config;

import com.tzompcomer.api.entity.Departamento;
import com.tzompcomer.api.entity.Producto;
import com.tzompcomer.api.repository.DepartamentoRepository;
import com.tzompcomer.api.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

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
            // ================================================
            // 1. CREAR DEPARTAMENTOS
            // ================================================
            Departamento despensa = new Departamento();
            despensa.setNombre("Despensa Básica");
            despensa.setIdentificadorIcono("despensa");
            despensa = departamentoRepository.save(despensa);

            Departamento lacteos = new Departamento();
            lacteos.setNombre("Lácteos y Huevos");
            lacteos.setIdentificadorIcono("lacteos");
            lacteos = departamentoRepository.save(lacteos);

            Departamento bebidas = new Departamento();
            bebidas.setNombre("Bebidas");
            bebidas.setIdentificadorIcono("bebidas");
            bebidas = departamentoRepository.save(bebidas);

            Departamento botanas = new Departamento();
            botanas.setNombre("Botanas y Snacks");
            botanas.setIdentificadorIcono("botanas");
            botanas = departamentoRepository.save(botanas);

            Departamento limpieza = new Departamento();
            limpieza.setNombre("Limpieza y Hogar");
            limpieza.setIdentificadorIcono("limpieza");
            limpieza = departamentoRepository.save(limpieza);

            // ================================================
            // 2. CREAR PRODUCTOS
            // ================================================
            
            // ---------- DESPENSA BÁSICA ----------
            Producto p1 = new Producto();
            p1.setSku("DSP-001");
            p1.setNombre("Arroz La Costeña 1kg");
            p1.setDescripcion("Arroz blanco premium de 1 kilogramo");
            p1.setPrecio(new BigDecimal("28.50"));
            p1.setDepartamento(despensa);
            p1.setCategoria("Arroz");
            p1.setImagenUrl("/productos/arroz.jpg");
            p1.setDisponible(true);
            productoRepository.save(p1);

            Producto p2 = new Producto();
            p2.setSku("DSP-002");
            p2.setNombre("Frijol Pinto 1kg");
            p2.setDescripcion("Frijol pinto de alta calidad");
            p2.setPrecio(new BigDecimal("32.00"));
            p2.setDepartamento(despensa);
            p2.setCategoria("Frijoles");
            p2.setImagenUrl("/productos/frijol.jpg");
            p2.setDisponible(true);
            productoRepository.save(p2);

            Producto p3 = new Producto();
            p3.setSku("DSP-003");
            p3.setNombre("Harina de Trigo 1kg");
            p3.setDescripcion("Harina de trigo para todo uso");
            p3.setPrecio(new BigDecimal("18.00"));
            p3.setDepartamento(despensa);
            p3.setCategoria("Harinas");
            p3.setImagenUrl("/productos/harina.jpg");
            p3.setDisponible(true);
            productoRepository.save(p3);

            // ---------- LÁCTEOS Y HUEVOS ----------
            Producto p4 = new Producto();
            p4.setSku("LAC-001");
            p4.setNombre("Leche Lala Light 1L");
            p4.setDescripcion("Leche descremada de 1 litro");
            p4.setPrecio(new BigDecimal("22.50"));
            p4.setDepartamento(lacteos);
            p4.setCategoria("Leche");
            p4.setImagenUrl("/productos/leche.jpg");
            p4.setDisponible(true);
            productoRepository.save(p4);

            Producto p5 = new Producto();
            p5.setSku("LAC-002");
            p5.setNombre("Huevo Blanco 30 piezas");
            p5.setDescripcion("Huevo blanco fresco, 30 unidades");
            p5.setPrecio(new BigDecimal("65.00"));
            p5.setDepartamento(lacteos);
            p5.setCategoria("Huevos");
            p5.setImagenUrl("/productos/huevo.jpg");
            p5.setDisponible(true);
            productoRepository.save(p5);

            Producto p6 = new Producto();
            p6.setSku("LAC-003");
            p6.setNombre("Queso Panela 400g");
            p6.setDescripcion("Queso panela fresco de 400 gramos");
            p6.setPrecio(new BigDecimal("48.00"));
            p6.setDepartamento(lacteos);
            p6.setCategoria("Quesos");
            p6.setImagenUrl("/productos/queso.jpg");
            p6.setDisponible(true);
            productoRepository.save(p6);

            // ---------- BEBIDAS ----------
            Producto p7 = new Producto();
            p7.setSku("BEB-001");
            p7.setNombre("Coca-Cola 3L");
            p7.setDescripcion("Refresco Coca-Cola familiar de 3 litros");
            p7.setPrecio(new BigDecimal("42.00"));
            p7.setDepartamento(bebidas);
            p7.setCategoria("Refrescos");
            p7.setImagenUrl("/productos/coca.jpg");
            p7.setDisponible(true);
            productoRepository.save(p7);

            Producto p8 = new Producto();
            p8.setSku("BEB-002");
            p8.setNombre("Jugo de Naranja 2L");
            p8.setDescripcion("Jugo de naranja 100% natural de 2 litros");
            p8.setPrecio(new BigDecimal("38.00"));
            p8.setDepartamento(bebidas);
            p8.setCategoria("Jugos");
            p8.setImagenUrl("/productos/jugo.jpg");
            p8.setDisponible(true);
            productoRepository.save(p8);

            Producto p9 = new Producto();
            p9.setSku("BEB-003");
            p9.setNombre("Agua Mineral 1.5L");
            p9.setDescripcion("Agua mineral natural de 1.5 litros");
            p9.setPrecio(new BigDecimal("18.00"));
            p9.setDepartamento(bebidas);
            p9.setCategoria("Aguas");
            p9.setImagenUrl("/productos/agua.jpg");
            p9.setDisponible(true);
            productoRepository.save(p9);

            // ---------- BOTANAS Y SNACKS ----------
            Producto p10 = new Producto();
            p10.setSku("BOT-001");
            p10.setNombre("Papas Sabritas 150g");
            p10.setDescripcion("Papas fritas clásicas de 150 gramos");
            p10.setPrecio(new BigDecimal("35.00"));
            p10.setDepartamento(botanas);
            p10.setCategoria("Papas");
            p10.setImagenUrl("/productos/papas.jpg");
            p10.setDisponible(true);
            productoRepository.save(p10);

            Producto p11 = new Producto();
            p11.setSku("BOT-002");
            p11.setNombre("Dulces de la Rosa");
            p11.setDescripcion("Dulces tradicionales mexicanos");
            p11.setPrecio(new BigDecimal("22.00"));
            p11.setDepartamento(botanas);
            p11.setCategoria("Dulces");
            p11.setImagenUrl("/productos/dulces.jpg");
            p11.setDisponible(true);
            productoRepository.save(p11);

            // ---------- LIMPIEZA Y HOGAR ----------
            Producto p12 = new Producto();
            p12.setSku("LIM-001");
            p12.setNombre("Cloro 4L");
            p12.setDescripcion("Cloro para desinfección de 4 litros");
            p12.setPrecio(new BigDecimal("45.00"));
            p12.setDepartamento(limpieza);
            p12.setCategoria("Cloro");
            p12.setImagenUrl("/productos/cloro.jpg");
            p12.setDisponible(true);
            productoRepository.save(p12);

            Producto p13 = new Producto();
            p13.setSku("LIM-002");
            p13.setNombre("Jabón de Barra");
            p13.setDescripcion("Jabón de barra para ropa, 5 piezas");
            p13.setPrecio(new BigDecimal("28.00"));
            p13.setDepartamento(limpieza);
            p13.setCategoria("Jabón");
            p13.setImagenUrl("/productos/jabon.jpg");
            p13.setDisponible(true);
            productoRepository.save(p13);

            Producto p14 = new Producto();
            p14.setSku("LIM-003");
            p14.setNombre("Detergente en Polvo 2kg");
            p14.setDescripcion("Detergente para ropa de 2 kilogramos");
            p14.setPrecio(new BigDecimal("52.00"));
            p14.setDepartamento(limpieza);
            p14.setCategoria("Detergentes");
            p14.setImagenUrl("/productos/detergente.jpg");
            p14.setDisponible(true);
            productoRepository.save(p14);

            System.out.println("✅ Datos de SUPER PRECIOS cargados exitosamente!");
        }
    }
}

# ================================================
# 2. MODIFICAR COLORES (index.css)
# ================================================
# Archivo: frontend/src/index.css

@import "tailwindcss";

@theme {
  /* COLORES DE SUPER PRECIOS */
  --color-shopify-gray: #F8F8F8;
  --color-shopify-text: #1a1a1a;
  --color-tzomp-azul: #2563EB;    /* Azul de supermercado */
  --color-tzomp-dorado: #F59E0B;   /* Naranja/Ámbar */
  --color-tzomp-azul-oscuro: #1D4ED8;
}

@layer base {
  body {
    @apply bg-shopify-gray text-shopify-text antialiased;
  }
  
  * {
    @apply border-gray-200;
  }
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

# ================================================
# 3. MODIFICAR HEADER (Header.jsx)
# ================================================
# Archivo: frontend/src/components/Header.jsx
# Cambiar el logo en las líneas ~15-20

<div className="flex items-center gap-2">
  <h1 className="text-2xl font-black tracking-tight text-shopify-text">
    🏪 <span className="text-tzomp-azul">SUPER PRECIOS</span>
  </h1>
</div>

# ================================================
# 4. MODIFICAR NÚMERO DE WHATSAPP
# ================================================
# Archivo: frontend/src/components/CheckoutModal.jsx
# Línea ~45
const numeroWhatsApp = '5215512345678';  // TU NÚMERO REAL AQUÍ

# ================================================
# 5. AGREGAR IMÁGENES
# ================================================
# Crea la carpeta: frontend/public/productos/
# Coloca tus imágenes con nombres:
# - arroz.jpg
# - frijol.jpg
# - harina.jpg
# - leche.jpg
# - huevo.jpg
# - queso.jpg
# - coca.jpg
# - jugo.jpg
# - agua.jpg
# - papas.jpg
# - dulces.jpg
# - cloro.jpg
# - jabon.jpg
# - detergente.jpg
