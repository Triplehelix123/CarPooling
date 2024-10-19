package com.example.car.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.car.model.Login;
import com.example.car.repository.LoginRepository;

import java.util.List;
import java.util.Optional;

@Service
public class LoginService {

    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Login createLogin(Login login) {
        String hashedPassword = passwordEncoder.encode(login.getPassword());
        login.setPassword(hashedPassword);
        return loginRepository.save(login);
    }

    public List<Login> getAllLogins() {
        return loginRepository.findAll();
    }

    public Optional<Login> getLoginById(Long id) {
        return loginRepository.findById(id);
    }

    public void deleteLogin(Long id) {
        loginRepository.deleteById(id);
    }

    public Login findByUsername(String username) {
        return loginRepository.findByUsername(username);
    }

    public Login findByEmail(String email) {
        return loginRepository.findByEmail(email);
    }

    public boolean usernameExists(String username) {
        return loginRepository.findByUsername(username) != null;
    }

    public boolean emailExists(String email) {
        return loginRepository.findByEmail(email) != null;
    }

    public boolean checkPassword(Login login, String rawPassword) {
        return passwordEncoder.matches(rawPassword, login.getPassword());
    }

    public Login updateLogin(Long id, Login loginDetails) {
        Optional<Login> existingLoginOpt = loginRepository.findById(id);
        if (existingLoginOpt.isPresent()) {
            Login existingLogin = existingLoginOpt.get();
            existingLogin.setUsername(loginDetails.getUsername());
            existingLogin.setEmail(loginDetails.getEmail());
            if (loginDetails.getPassword() != null && !loginDetails.getPassword().isEmpty()) {
                existingLogin.setPassword(passwordEncoder.encode(loginDetails.getPassword()));
            }
            existingLogin.setRole(loginDetails.getRole());
            return loginRepository.save(existingLogin);
        } else {
            return null;
        }
    }
}