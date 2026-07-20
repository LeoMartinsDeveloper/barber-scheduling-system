package br.com.projeto.gerenciamento.controller;

import br.com.projeto.gerenciamento.model.Agendamento;
import br.com.projeto.gerenciamento.repository.AgendamentoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.projeto.gerenciamento.model.Agendamento;
import br.com.projeto.gerenciamento.repository.AgendamentoRepository;
import br.com.projeto.gerenciamento.service.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

}