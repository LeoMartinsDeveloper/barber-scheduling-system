package br.com.projeto.gerenciamento.controller;

import br.com.projeto.gerenciamento.model.Administrador;
import br.com.projeto.gerenciamento.model.Administrador;

import java.util.Optional;


import br.com.projeto.gerenciamento.model.Administrador;
import br.com.projeto.gerenciamento.repository.AdmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/adm")
@CrossOrigin("*")
public class AdmController {

    @Autowired
    private AdmRepository repository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Administrador adm){

        System.out.println("Email: " + adm.getEmail());
        System.out.println("Senha: " + adm.getSenha());

        Optional<Administrador> usuario =
                repository.findByEmailAndSenha(
                        adm.getEmail(),
                        adm.getSenha()
                );

        System.out.println("Encontrou? " + usuario.isPresent());

        if(usuario.isPresent()){
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}