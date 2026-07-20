package br.com.projeto.gerenciamento.controller;

import br.com.projeto.gerenciamento.model.Barbeiro;
import br.com.projeto.gerenciamento.repository.BarbeiroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/barbeiros")
@CrossOrigin(origins = "*")
public class BarbeiroController{

    @Autowired
    public BarbeiroRepository barbeiroRepository;

    // Listar todos os barbeiros
    @GetMapping
    public List<Barbeiro> listarTodos() {
        return barbeiroRepository.findAll();
    }

    // Buscar barbeiro por ID
    @GetMapping("/{id}")
    public Optional<Barbeiro> buscarPorId(@PathVariable Long id) {
        return barbeiroRepository.findById(id);
    }

    // Cadastrar barbeiro
    @PostMapping
    public Barbeiro cadastrar(@RequestBody Barbeiro barbeiro) {
        return barbeiroRepository.save(barbeiro);
    }

    // Editar barbeiro
    @PutMapping("/{id}")
    public Barbeiro editar(@PathVariable Long id,
                           @RequestBody Barbeiro barbeiroAtualizado) {

        Barbeiro barbeiro = barbeiroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Barbeiro não encontrado."));

        barbeiro.setNome(barbeiroAtualizado.getNome());
        barbeiro.setDescricao(barbeiroAtualizado.getDescricao());
        barbeiro.setTelefone(barbeiroAtualizado.getTelefone());
        barbeiro.setEspecialidade(barbeiroAtualizado.getEspecialidade());
        barbeiro.setStatus(barbeiroAtualizado.getStatus());
        barbeiro.setFoto(barbeiroAtualizado.getFoto());

        return barbeiroRepository.save(barbeiro);
    }

    // Excluir barbeiro
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        barbeiroRepository.deleteById(id);
    }
}