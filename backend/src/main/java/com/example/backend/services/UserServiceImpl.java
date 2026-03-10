package com.example.backend.services;

import com.example.backend.dtos.LoginDto;
import com.example.backend.dtos.UserRegistrationDto;
import com.example.backend.models.Role;
import com.example.backend.models.User;
import com.example.backend.repositories.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User registerUser(UserRegistrationDto registrationDto) {
        if (userRepository.existsByUsername(registrationDto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(registrationDto.getUsername());
        user.setEmail(registrationDto.getEmail());
        // Hash password with BCrypt before storing
        user.setPassword(BCrypt.hashpw(registrationDto.getPassword(), BCrypt.gensalt()));
        user.setRole(Role.USER); // All new registrations default to USER

        return userRepository.save(user);
    }

    @Override
    public User authenticateUser(LoginDto loginDto) {
        Optional<User> userOptional = userRepository.findByUsername(loginDto.getUsername());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Check BCrypt hash. Also support plain-text for legacy accounts
            boolean passwordMatches;
            try {
                passwordMatches = BCrypt.checkpw(loginDto.getPassword(), user.getPassword());
            } catch (Exception e) {
                // Fallback: plain text comparison for accounts before hashing was added
                passwordMatches = user.getPassword().equals(loginDto.getPassword());
            }
            if (passwordMatches) {
                return user;
            }
        }
        throw new RuntimeException("Invalid username or password");
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
