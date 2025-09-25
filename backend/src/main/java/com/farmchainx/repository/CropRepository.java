package com.farmchainx.repository;

import com.farmchainx.model.Crop;
import com.farmchainx.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {
    List<Crop> findByUser(User user);
    
    List<Crop> findByUserId(Long userId);
    
    @Query("SELECT c FROM Crop c WHERE c.farmerId = :farmerId")
    List<Crop> findByFarmerId(@Param("farmerId") String farmerId);
    
    @Query("SELECT c FROM Crop c WHERE c.distributorId = :distributorId")
    List<Crop> findByDistributorId(@Param("distributorId") String distributorId);
    
    @Query("SELECT c FROM Crop c JOIN c.user u WHERE u.farmerId = :farmerId AND u.role = 'FARMER'")
    List<Crop> findCropsByFarmerId(@Param("farmerId") String farmerId);
    
    @Query("SELECT c FROM Crop c JOIN c.user u WHERE u.distributorId = :distributorId AND u.role = 'DISTRIBUTOR'")
    List<Crop> findCropsByDistributorId(@Param("distributorId") String distributorId);
}