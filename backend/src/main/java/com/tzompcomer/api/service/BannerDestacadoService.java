package com.tzompcomer.api.service;

import com.tzompcomer.api.entity.BannerDestacado;
import com.tzompcomer.api.repository.BannerDestacadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BannerDestacadoService {

    private final BannerDestacadoRepository bannerDestacadoRepository;

    public List<BannerDestacado> findAll() {
        return bannerDestacadoRepository.findAll();
    }

    public Optional<BannerDestacado> findById(Long id) {
        return bannerDestacadoRepository.findById(id);
    }

    @Transactional
    public BannerDestacado save(BannerDestacado banner) {
        return bannerDestacadoRepository.save(banner);
    }

    @Transactional
    public void deleteById(Long id) {
        bannerDestacadoRepository.deleteById(id);
    }
}
