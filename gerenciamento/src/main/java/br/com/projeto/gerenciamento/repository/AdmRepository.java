package br.com.projeto.gerenciamento.repository;


import br.com.projeto.gerenciamento.model.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import br.com.projeto.gerenciamento.model.Administrador;

@Repository
public interface AdmRepository extends JpaRepository<Administrador, Long> {

    Optional<Administrador> findByEmailAndSenha(String email, String senha);

}