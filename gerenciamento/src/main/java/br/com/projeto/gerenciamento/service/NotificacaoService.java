package br.com.projeto.gerenciamento.service;
import br.com.projeto.gerenciamento.model.Agendamento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NotificacaoService {

    @Autowired
    private JavaMailSender mailSender;
    private final RestTemplate restTemplate = new RestTemplate();
    public void enviarConfirmacoes(Agendamento agendamento) {
        enviarEmail(agendamento);
        enviarWhatsApp(agendamento);
    }

    private void enviarEmail (Agendamento agendamento) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(agendamento.getEmail());
        message.setSubject("WeBarber - Horário Confirmado!");
        message.setText("Olá " + agendamento.getNome() + ", seu agendamento com o profissional " + agendamento.getBarbeiro() + " para o dia " +
         agendamento.getDataAgendamento() + " às " + agendamento.getHorario() + " foi confirmado com sucesso!");

         mailSender.send(message);
    }

    private void enviarWhatsApp(Agendamento agendamento) {
        String urlapi = "https://api.provedorwhatsapp.com/send";
    }

}