package com.farmchainx.service;

import com.farmchainx.model.Crop;
import com.farmchainx.model.User;
import com.farmchainx.repository.CropRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CropService {

    @Autowired
    private CropRepository cropRepository;

    public Crop saveCrop(Crop crop) {
        return cropRepository.save(crop);
    }

    public List<Crop> getCropsByUser(User user) {
        return cropRepository.findByUser(user);
    }

    public List<Crop> getCropsByUserId(Long userId) {
        return cropRepository.findByUserId(userId);
    }

    public List<Crop> getCropsByFarmerId(String farmerId) {
        return cropRepository.findCropsByFarmerId(farmerId);
    }

    public List<Crop> getCropsByDistributorId(String distributorId) {
        return cropRepository.findCropsByDistributorId(distributorId);
    }

    public Optional<Crop> getCropById(Long id) {
        return cropRepository.findById(id);
    }

    public void deleteCrop(Long id) {
        cropRepository.deleteById(id);
    }

    public Crop updateCrop(Crop crop) {
        return cropRepository.save(crop);
    }
}