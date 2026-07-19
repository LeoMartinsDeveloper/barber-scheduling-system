package br.com.projeto.gerenciamento.repository;

import br.com.projeto.gerenciamento.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Long> {

}