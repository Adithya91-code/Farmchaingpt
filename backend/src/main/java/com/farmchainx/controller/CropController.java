package com.farmchainx.controller;

import com.farmchainx.model.Crop;
import com.farmchainx.model.User;
import com.farmchainx.service.CropService;
import com.farmchainx.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/crops")
public class CropController {

    @Autowired
    private CropService cropService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Crop>> getUserCrops() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        List<Crop> crops = cropService.getCropsByUser(user);
        return ResponseEntity.ok(crops);
    }

    @PostMapping
    public ResponseEntity<?> createCrop(@Valid @RequestBody Crop crop) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) auth.getPrincipal();
            crop.setUser(user);

            // Set farmer info if user is a farmer
            if (user.getRole().name().equals("FARMER")) {
                crop.setFarmerId(user.getFarmerId());
                crop.setFarmerName(user.getName());
                crop.setFarmerLocation(user.getLocation());
            }

            Crop savedCrop = cropService.saveCrop(crop);
            return ResponseEntity.ok(savedCrop);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating crop: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCrop(@PathVariable Long id, @Valid @RequestBody Crop cropDetails) {
        try {
            Optional<Crop> cropOptional = cropService.getCropById(id);
            if (!cropOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Crop crop = cropOptional.get();
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) auth.getPrincipal();

            // Check if user owns the crop or is updating supply chain info
            if (!crop.getUser().getId().equals(user.getId()) &&
                !user.getRole().name().equals("DISTRIBUTOR") &&
                !user.getRole().name().equals("RETAILER")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Update crop fields
            crop.setName(cropDetails.getName());
            crop.setCropType(cropDetails.getCropType());
            crop.setHarvestDate(cropDetails.getHarvestDate());
            crop.setExpiryDate(cropDetails.getExpiryDate());
            crop.setSoilType(cropDetails.getSoilType());
            crop.setPesticidesUsed(cropDetails.getPesticidesUsed());
            crop.setImageUrl(cropDetails.getImageUrl());

            // Update supply chain info based on user role
            if (user.getRole().name().equals("DISTRIBUTOR")) {
                crop.setDistributorId(user.getDistributorId());
                crop.setDistributorName(user.getName());
                crop.setDistributorLocation(user.getLocation());
                crop.setDistributorReceivedDate(cropDetails.getDistributorReceivedDate());
                crop.setSentToRetailer(cropDetails.getSentToRetailer());
                crop.setRetailerLocation(cropDetails.getRetailerLocation());
            } else if (user.getRole().name().equals("RETAILER")) {
                crop.setRetailerName(user.getName());
                crop.setRetailerReceivedDate(cropDetails.getRetailerReceivedDate());
                crop.setReceivedFromDistributor(cropDetails.getReceivedFromDistributor());
                crop.setDistributorLocationRetailer(cropDetails.getDistributorLocationRetailer());
            }

            Crop updatedCrop = cropService.updateCrop(crop);
            return ResponseEntity.ok(updatedCrop);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating crop: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCrop(@PathVariable Long id) {
        try {
            Optional<Crop> cropOptional = cropService.getCropById(id);
            if (!cropOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Crop crop = cropOptional.get();
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) auth.getPrincipal();

            // Only crop owner can delete
            if (!crop.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You cannot delete this crop");
            }

            cropService.deleteCrop(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting crop: " + e.getMessage());
        }
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<Crop>> getCropsByFarmerId(@PathVariable String farmerId) {
        List<Crop> crops = cropService.getCropsByFarmerId(farmerId);
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/distributor/{distributorId}")
    public ResponseEntity<List<Crop>> getCropsByDistributorId(@PathVariable String distributorId) {
        List<Crop> crops = cropService.getCropsByDistributorId(distributorId);
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/scan/{cropId}")
    public ResponseEntity<?> getCropForScanning(@PathVariable Long cropId) {
        try {
            Optional<Crop> cropOptional = cropService.getCropById(cropId);
            if (!cropOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Crop not found");
            }

            Crop crop = cropOptional.get();
            return ResponseEntity.ok(crop);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving crop: " + e.getMessage());
        }
    }
}
