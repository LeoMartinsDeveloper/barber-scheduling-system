package br.com.projeto.gerenciamento.controller;

import br.com.projeto.gerenciamento.model.Agendamento;
import br.com.projeto.gerenciamento.repository.AgendamentoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

<<<<<<< HEAD
import br.com.projeto.gerenciamento.model.Agendamento;
import br.com.projeto.gerenciamento.repository.AgendamentoRepository;
import br.com.projeto.gerenciamento.service.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
=======
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
>>>>>>> 3eff42689b9ef9e93ea9876f4d1c5feab420c25d

@RestController
@RequestMapping("/agendamento")
@CrossOrigin("*")
public class AgendamentoController {

    @Autowired
    private AgendamentoRepository repository;

    @Autowired
    private NotificacaoService notificacaoService;

    @PostMapping
    public ResponseEntity<Agendamento> salvar(@RequestBody Agendamento agendamento) {

        Agendamento novoAgendamento = repository.save(agendamento);

        notificacaoService.enviarConfirmacoes(novoAgendamento);

        return ResponseEntity.ok(novoAgendamento);
    }

    @GetMapping("/ocupados")
    public ResponseEntity<List<LocalTime>> buscarHorariosOcupados(
            @RequestParam String barbeiro,
            @RequestParam LocalDate data) {

        List<LocalTime> horarios = repository
                .findByBarbeiroAndDataAgendamento(barbeiro, data)
                .stream()
                .map(Agendamento::getHorario)
                .toList();

        return ResponseEntity.ok(horarios);
    }

}