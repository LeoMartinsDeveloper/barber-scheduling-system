package br.com.projeto.gerenciamento.repository;

import br.com.projeto.gerenciamento.model.Bloqueio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BloqueioRepository extends JpaRepository<Bloqueio, Long> {

    // Bloqueios de dia inteiro (sem horário definido)
    List<Bloqueio> findByHorarioIsNull();

    // Dia inteiro bloqueado em uma data específica
    List<Bloqueio> findByDataAndHorarioIsNull(LocalDate data);

    // Horários bloqueados de um barbeiro em uma data
    List<Bloqueio> findByBarbeiroAndDataAndHorarioIsNotNull(String barbeiro, LocalDate data);

    // Todos os horários bloqueados de um barbeiro numa data (para regravar)
    List<Bloqueio> findByBarbeiroAndData(String barbeiro, LocalDate data);
}
