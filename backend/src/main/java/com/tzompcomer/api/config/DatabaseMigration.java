package com.tzompcomer.api.config;

import com.tzompcomer.api.entity.BannerDestacado;
import com.tzompcomer.api.repository.BannerDestacadoRepository;
import com.tzompcomer.api.repository.ProductoRepository;
import com.tzompcomer.api.service.CatalogSeedService;
import com.tzompcomer.api.service.ExcelImportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseMigration {

    private final ProductoRepository productoRepository;
    private final ExcelImportService excelImportService;
    private final CatalogSeedService catalogSeedService;
    private final BannerDestacadoRepository bannerDestacadoRepository;
    @Qualifier("catalogImportExecutor")
    private final TaskExecutor catalogImportExecutor;

    @Value("${catalog.auto-import:true}")
    private boolean autoImport;

    private final AtomicBoolean importInProgress = new AtomicBoolean(false);
    private final AtomicBoolean importCompleted = new AtomicBoolean(false);

    public boolean isImportInProgress() {
        return importInProgress.get();
    }

    public boolean isImportCompleted() {
        return importCompleted.get();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        catalogSeedService.seedCatalogIfEmpty();
        seedBannersIfEmpty();
        catalogImportExecutor.execute(this::runImportIfNeeded);
    }

    private void runImportIfNeeded() {
        if (!autoImport) {
            log.info("Importación automática desactivada (catalog.auto-import=false)");
            return;
        }
        if (productoRepository.count() > 0) {
            importCompleted.set(true);
            log.info("BD con {} productos — importación automática omitida", productoRepository.count());
            return;
        }
        importInProgress.set(true);
        try {
            importFromAvailableExcel();
            importCompleted.set(true);
        } finally {
            importInProgress.set(false);
        }
    }

    private void importFromAvailableExcel() {
        try {
            InputStream stream = openExcelStream();
            if (stream == null) {
                log.warn("No se encontró productos.xlsx — sube el catálogo desde el panel admin");
                return;
            }
            log.info("Iniciando importación B2B desde Excel (puede tardar ~1 min)...");
            try (stream) {
                Map<String, Object> result = excelImportService.importExcel(stream);
                log.info("Importación B2B completada: {}", result);
            }
        } catch (Exception e) {
            log.error("Error en importación automática: {}", e.getMessage(), e);
        }
    }

    private InputStream openExcelStream() throws Exception {
        ClassPathResource resource = new ClassPathResource("productos.xlsx");
        if (resource.exists()) {
            return resource.getInputStream();
        }
        Path rootExcel = Path.of("productos.xlsx");
        if (Files.exists(rootExcel)) {
            return Files.newInputStream(rootExcel);
        }
        Path parentExcel = Path.of("../productos.xlsx");
        if (Files.exists(parentExcel)) {
            return Files.newInputStream(parentExcel);
        }
        return null;
    }

    private void seedBannersIfEmpty() {
        if (bannerDestacadoRepository.count() > 0) {
            return;
        }
        List<String> urls = List.of(
                "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80"
        );
        for (String url : urls) {
            bannerDestacadoRepository.save(BannerDestacado.builder().imagenUrl(url).build());
        }
        log.info("Banners destacados sembrados: {}", urls.size());
    }
}
