package br.com.projeto.gerenciamento.controller;

import br.com.projeto.gerenciamento.model.Servico;
import br.com.projeto.gerenciamento.repository.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/servicos")
@CrossOrigin(origins = "*")
public class ServicoController {

    @Autowired
    private ServicoRepository servicoRepository;

    @GetMapping
    public List<Servico> listarTodos() {
        return servicoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servico> buscarPorId(@PathVariable Long id) {

        return servicoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());

    }

    @PostMapping
    public ResponseEntity<Servico> cadastrar(@RequestBody Servico servico) {

        Servico novo = servicoRepository.save(servico);

        return ResponseEntity.ok(novo);

    }

    @PutMapping("/{id}")
    public ResponseEntity<Servico> editar(@PathVariable Long id,
                                          @RequestBody Servico servicoAtualizado) {

        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado."));

        servico.setNome(servicoAtualizado.getNome());
        servico.setDescricao(servicoAtualizado.getDescricao());
        servico.setPreco(servicoAtualizado.getPreco());
        servico.setDuracao(servicoAtualizado.getDuracao());

        Servico atualizado = servicoRepository.save(servico);

        return ResponseEntity.ok(atualizado);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {

        servicoRepository.deleteById(id);

        return ResponseEntity.noContent().build();

    }

}