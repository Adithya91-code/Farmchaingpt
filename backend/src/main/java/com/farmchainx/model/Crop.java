package com.farmchainx.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "crops")
public class Crop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 50)
    @Column(name = "crop_type")
    private String cropType;

    @NotNull
    @Column(name = "harvest_date")
    private LocalDate harvestDate;

    @NotNull
    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @NotBlank
    @Size(max = 50)
    @Column(name = "soil_type")
    private String soilType;

    @Size(max = 500)
    @Column(name = "pesticides_used")
    private String pesticidesUsed;

    @Size(max = 500)
    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Supply Chain Information
    @Column(name = "farmer_id", length = 3)
    private String farmerId;

    @Size(max = 100)
    @Column(name = "farmer_name")
    private String farmerName;

    @Size(max = 200)
    @Column(name = "farmer_location")
    private String farmerLocation;

    @Column(name = "distributor_id", length = 3)
    private String distributorId;

    @Size(max = 100)
    @Column(name = "distributor_name")
    private String distributorName;

    @Size(max = 200)
    @Column(name = "distributor_location")
    private String distributorLocation;

    @Column(name = "distributor_received_date")
    private LocalDate distributorReceivedDate;

    @Size(max = 100)
    @Column(name = "sent_to_retailer")
    private String sentToRetailer;

    @Size(max = 200)
    @Column(name = "retailer_location")
    private String retailerLocation;

    @Size(max = 100)
    @Column(name = "retailer_name")
    private String retailerName;

    @Column(name = "retailer_received_date")
    private LocalDate retailerReceivedDate;

    @Size(max = 100)
    @Column(name = "received_from_distributor")
    private String receivedFromDistributor;

    @Size(max = 200)
    @Column(name = "distributor_location_retailer")
    private String distributorLocationRetailer;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Crop() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCropType() {
        return cropType;
    }

    public void setCropType(String cropType) {
        this.cropType = cropType;
    }

    public LocalDate getHarvestDate() {
        return harvestDate;
    }

    public void setHarvestDate(LocalDate harvestDate) {
        this.harvestDate = harvestDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public String getPesticidesUsed() {
        return pesticidesUsed;
    }

    public void setPesticidesUsed(String pesticidesUsed) {
        this.pesticidesUsed = pesticidesUsed;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(String farmerId) {
        this.farmerId = farmerId;
    }

    public String getFarmerName() {
        return farmerName;
    }

    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }

    public String getFarmerLocation() {
        return farmerLocation;
    }

    public void setFarmerLocation(String farmerLocation) {
        this.farmerLocation = farmerLocation;
    }

    public String getDistributorId() {
        return distributorId;
    }

    public void setDistributorId(String distributorId) {
        this.distributorId = distributorId;
    }

    public String getDistributorName() {
        return distributorName;
    }

    public void setDistributorName(String distributorName) {
        this.distributorName = distributorName;
    }

    public String getDistributorLocation() {
        return distributorLocation;
    }

    public void setDistributorLocation(String distributorLocation) {
        this.distributorLocation = distributorLocation;
    }

    public LocalDate getDistributorReceivedDate() {
        return distributorReceivedDate;
    }

    public void setDistributorReceivedDate(LocalDate distributorReceivedDate) {
        this.distributorReceivedDate = distributorReceivedDate;
    }

    public String getSentToRetailer() {
        return sentToRetailer;
    }

    public void setSentToRetailer(String sentToRetailer) {
        this.sentToRetailer = sentToRetailer;
    }

    public String getRetailerLocation() {
        return retailerLocation;
    }

    public void setRetailerLocation(String retailerLocation) {
        this.retailerLocation = retailerLocation;
    }

    public String getRetailerName() {
        return retailerName;
    }

    public void setRetailerName(String retailerName) {
        this.retailerName = retailerName;
    }

    public LocalDate getRetailerReceivedDate() {
        return retailerReceivedDate;
    }

    public void setRetailerReceivedDate(LocalDate retailerReceivedDate) {
        this.retailerReceivedDate = retailerReceivedDate;
    }

    public String getReceivedFromDistributor() {
        return receivedFromDistributor;
    }

    public void setReceivedFromDistributor(String receivedFromDistributor) {
        this.receivedFromDistributor = receivedFromDistributor;
    }

    public String getDistributorLocationRetailer() {
        return distributorLocationRetailer;
    }

    public void setDistributorLocationRetailer(String distributorLocationRetailer) {
        this.distributorLocationRetailer = distributorLocationRetailer;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}