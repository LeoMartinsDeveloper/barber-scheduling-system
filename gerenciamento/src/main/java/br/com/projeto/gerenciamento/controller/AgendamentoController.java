package br.com.projeto.gerenciamento.controller;

import br.com.projeto.gerenciamento.model.Agendamento;
import br.com.projeto.gerenciamento.model.Bloqueio;
import br.com.projeto.gerenciamento.repository.AgendamentoRepository;
import br.com.projeto.gerenciamento.repository.BloqueioRepository;
import br.com.projeto.gerenciamento.service.NotificacaoService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/agendamento")
@CrossOrigin("*")
public class AgendamentoController {

    // Grade padrão de horários de atendimento (usada para bloqueio de dia inteiro)
    private static final List<LocalTime> GRADE_PADRAO = List.of(
            LocalTime.of(8, 0), LocalTime.of(9, 0), LocalTime.of(10, 0),
            LocalTime.of(11, 0), LocalTime.of(13, 0), LocalTime.of(14, 0),
            LocalTime.of(15, 0), LocalTime.of(16, 0)
    );

    @Autowired
    private AgendamentoRepository repository;

    @Autowired
    private BloqueioRepository bloqueioRepository;

    @Autowired
    private NotificacaoService notificacaoService;

    @GetMapping
    public List<Agendamento> listar() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Agendamento agendamento) {

        // Integridade: não permite agendar em horário ocupado ou bloqueado
        if (horarioIndisponivel(agendamento.getBarbeiro(),
                agendamento.getDataAgendamento(),
                agendamento.getHorario())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Horário indisponível para este profissional.");
        }

        Agendamento novoAgendamento = repository.save(agendamento);
        notificacaoService.enviarConfirmacoes(novoAgendamento);
        return ResponseEntity.ok(novoAgendamento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Agendamento> editar(@PathVariable Long id,
                                              @RequestBody Agendamento atualizado) {

        Agendamento agendamento = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado."));

        agendamento.setNome(atualizado.getNome());
        agendamento.setEmail(atualizado.getEmail());
        agendamento.setTelefone(atualizado.getTelefone());
        agendamento.setBarbeiro(atualizado.getBarbeiro());
        agendamento.setDataAgendamento(atualizado.getDataAgendamento());
        agendamento.setHorario(atualizado.getHorario());
        agendamento.setServicos(atualizado.getServicos());
        agendamento.setValorTotal(atualizado.getValorTotal());

        return ResponseEntity.ok(repository.save(agendamento));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ocupados")
    public ResponseEntity<List<LocalTime>> buscarHorariosOcupados(
            @RequestParam String barbeiro,
            @RequestParam LocalDate data) {

        // Mantém a ordem e evita duplicados
        Set<LocalTime> indisponiveis = new LinkedHashSet<>();

        // 1) Horários já agendados
        repository.findByBarbeiroAndDataAgendamento(barbeiro, data)
                .stream()
                .map(Agendamento::getHorario)
                .forEach(indisponiveis::add);

        // 2) Dia inteiro bloqueado -> toda a grade fica indisponível
        boolean diaBloqueado = !bloqueioRepository
                .findByDataAndHorarioIsNull(data).isEmpty();
        if (diaBloqueado) {
            indisponiveis.addAll(GRADE_PADRAO);
        }

        // 3) Horários bloqueados especificamente para este barbeiro
        bloqueioRepository.findByBarbeiroAndDataAndHorarioIsNotNull(barbeiro, data)
                .stream()
                .map(Bloqueio::getHorario)
                .forEach(indisponiveis::add);

        return ResponseEntity.ok(List.copyOf(indisponiveis));
    }

    private boolean horarioIndisponivel(String barbeiro, LocalDate data, LocalTime horario) {
        if (barbeiro == null || data == null || horario == null) {
            return false;
        }

        boolean jaAgendado = repository
                .findByBarbeiroAndDataAgendamento(barbeiro, data)
                .stream()
                .anyMatch(a -> horario.equals(a.getHorario()));

        boolean diaBloqueado = !bloqueioRepository
                .findByDataAndHorarioIsNull(data).isEmpty();

        boolean horarioBloqueado = bloqueioRepository
                .findByBarbeiroAndDataAndHorarioIsNotNull(barbeiro, data)
                .stream()
                .anyMatch(b -> horario.equals(b.getHorario()));

        return jaAgendado || diaBloqueado || horarioBloqueado;
    }
}
