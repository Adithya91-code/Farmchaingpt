package com.farmchainx.service;

import com.farmchainx.model.User;
import com.farmchainx.model.UserRole;
import com.farmchainx.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(String email, String password, String name, String location, UserRole role) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already taken!");
        }

        User user = new User(email, passwordEncoder.encode(password), name, location, role);

        // Generate unique IDs based on role
        if (role == UserRole.FARMER) {
            user.setFarmerId(generateUniqueFarmerId());
        } else if (role == UserRole.DISTRIBUTOR) {
            user.setDistributorId(generateUniqueDistributorId());
        }

        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findFarmerByFarmerId(String farmerId) {
        return userRepository.findFarmerByFarmerId(farmerId);
    }

    public Optional<User> findDistributorByDistributorId(String distributorId) {
        return userRepository.findDistributorByDistributorId(distributorId);
    }

    private String generateUniqueFarmerId() {
        String farmerId;
        Random random = new Random();
        do {
            farmerId = String.format("%03d", random.nextInt(1000));
        } while (userRepository.existsByFarmerId(farmerId));
        return farmerId;
    }

    private String generateUniqueDistributorId() {
        String distributorId;
        Random random = new Random();
        do {
            distributorId = String.format("%03d", random.nextInt(1000));
        } while (userRepository.existsByDistributorId(distributorId));
        return distributorId;
    }
}