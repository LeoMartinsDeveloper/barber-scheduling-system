package br.com.projeto.gerenciamento.repository;

import br.com.projeto.gerenciamento.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    List<Agendamento> findByBarbeiroAndDataAgendamento(String barbeiro, LocalDate dataAgendamento);
}