package br.com.projeto.gerenciamento.controller;

import br.com.projeto.gerenciamento.model.Bloqueio;
import br.com.projeto.gerenciamento.repository.BloqueioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/bloqueios")
@CrossOrigin(origins = "*")
public class BloqueioController {

    @Autowired
    private BloqueioRepository repository;

    // ---------------- Dias bloqueados (dia inteiro) ----------------

    @GetMapping("/dias")
    public List<Bloqueio> listarDias() {
        return repository.findByHorarioIsNull();
    }

    @PostMapping("/dias")
    public ResponseEntity<Bloqueio> bloquearDia(@RequestBody Bloqueio bloqueio) {
        // Dia inteiro: sem barbeiro e sem horário
        bloqueio.setId(null);
        bloqueio.setBarbeiro(null);
        bloqueio.setHorario(null);

        // Evita duplicar o mesmo dia
        List<Bloqueio> existentes = repository.findByDataAndHorarioIsNull(bloqueio.getData());
        if (!existentes.isEmpty()) {
            return ResponseEntity.ok(existentes.get(0));
        }

        return ResponseEntity.ok(repository.save(bloqueio));
    }

    @DeleteMapping("/dias/{id}")
    public ResponseEntity<Void> desbloquearDia(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---------------- Horários bloqueados por barbeiro ----------------

    @GetMapping("/horarios")
    public List<LocalTime> listarHorarios(
            @RequestParam String barbeiro,
            @RequestParam LocalDate data) {

        return repository
                .findByBarbeiroAndDataAndHorarioIsNotNull(barbeiro, data)
                .stream()
                .map(Bloqueio::getHorario)
                .toList();
    }

    // Regrava o conjunto de horários bloqueados de um barbeiro em uma data.
    @PostMapping("/horarios")
    public ResponseEntity<List<Bloqueio>> salvarHorarios(@RequestBody BloqueioHorariosRequest req) {

        // Remove os horários já bloqueados desse barbeiro/data (mantém dia inteiro se houver)
        List<Bloqueio> antigos = repository.findByBarbeiroAndData(req.barbeiro(), req.data());
        antigos.stream()
                .filter(b -> b.getHorario() != null)
                .forEach(b -> repository.deleteById(b.getId()));

        if (req.horarios() == null) {
            return ResponseEntity.ok(List.of());
        }

        List<Bloqueio> salvos = req.horarios().stream()
                .map(hora -> {
                    Bloqueio b = new Bloqueio();
                    b.setBarbeiro(req.barbeiro());
                    b.setData(req.data());
                    b.setHorario(LocalTime.parse(hora));
                    return repository.save(b);
                })
                .toList();

        return ResponseEntity.ok(salvos);
    }

    // DTO para o envio em lote de horários (aceita "08:00" ou "08:00:00")
    public record BloqueioHorariosRequest(String barbeiro, LocalDate data, List<String> horarios) {
    }
}
