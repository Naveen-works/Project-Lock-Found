package com.example.backend.services;

import com.example.backend.dtos.LoginDto;
import com.example.backend.dtos.UserRegistrationDto;
import com.example.backend.models.User;

public interface UserService {
    User registerUser(UserRegistrationDto registrationDto);

    User authenticateUser(LoginDto loginDto);

    User findByUsername(String username);
}
