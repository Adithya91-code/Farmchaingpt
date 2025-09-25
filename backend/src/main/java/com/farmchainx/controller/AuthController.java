package com.farmchainx.controller;

import com.farmchainx.dto.AuthRequest;
import com.farmchainx.dto.AuthResponse;
import com.farmchainx.dto.SignupRequest;
import com.farmchainx.model.User;
import com.farmchainx.security.JwtUtils;
import com.farmchainx.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserService userService;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            User user = (User) authentication.getPrincipal();

            return ResponseEntity.ok(new AuthResponse(jwt,
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getLocation(),
                    user.getRole(),
                    user.getFarmerId(),
                    user.getDistributorId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Invalid email or password!");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            User user = userService.createUser(
                    signUpRequest.getEmail(),
                    signUpRequest.getPassword(),
                    signUpRequest.getName(),
                    signUpRequest.getLocation(),
                    signUpRequest.getRole()
            );

            return ResponseEntity.ok().body("User registered successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}