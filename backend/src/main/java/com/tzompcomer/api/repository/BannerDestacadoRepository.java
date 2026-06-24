package com.tzompcomer.api.repository;

import com.tzompcomer.api.entity.BannerDestacado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BannerDestacadoRepository extends JpaRepository<BannerDestacado, Long> {
}
