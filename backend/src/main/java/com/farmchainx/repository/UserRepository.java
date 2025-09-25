package com.farmchainx.repository;

import com.farmchainx.model.User;
import com.farmchainx.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    boolean existsByFarmerId(String farmerId);
    
    boolean existsByDistributorId(String distributorId);
    
    Optional<User> findByFarmerIdAndRole(String farmerId, UserRole role);
    
    Optional<User> findByDistributorIdAndRole(String distributorId, UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.farmerId = :farmerId AND u.role = 'FARMER'")
    Optional<User> findFarmerByFarmerId(@Param("farmerId") String farmerId);
    
    @Query("SELECT u FROM User u WHERE u.distributorId = :distributorId AND u.role = 'DISTRIBUTOR'")
    Optional<User> findDistributorByDistributorId(@Param("distributorId") String distributorId);
}