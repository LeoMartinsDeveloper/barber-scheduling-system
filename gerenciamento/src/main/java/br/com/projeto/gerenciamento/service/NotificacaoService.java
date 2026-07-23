package br.com.projeto.gerenciamento.service;
import br.com.projeto.gerenciamento.model.Agendamento;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NotificacaoService {

    @Autowired
    private JavaMailSender mailSender;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${whatsapp.api.url:https://api.teste.com/send-message}")
    private String whatsappURL;

    @value("${whatsapp.api.token:teste}")
    private String whatsappToken;

    public void enviarConfirmacoes(Agendamento agendamento) {
        enviarEmail(agendamento);
        enviarWhatsApp(agendamento);
    }

    private void enviarEmail (Agendamento agendamento) {
        try { SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(agendamento.getEmail());
        message.setSubject("WeBarber - Horário Confirmado!");
        message.setText("Olá " + agendamento.getNome() + ", seu agendamento com o profissional " + agendamento.getBarbeiro() + " para o dia " +
         agendamento.getDataAgendamento() + " às " + agendamento.getHorario() + " foi confirmado com sucesso!");

         mailSender.send(message);
    } catch (Exception e) {
        System.err.println("Erro ao enviar e-mail: " + e.getMessage());
    }

private void enviarWhatsApp(Agendamento agendamento) {
        try {

            //objeto pra formatação do numero pra ex: 5534999999999
            String telefoneFormatado = formatarTelefone(agendamento.getTelefone());

            //escopo da mensagem
            String mensagem = String.format(
                "Olá *%s*! Seu agendamento na *WeBarber* foi confirmado com sucesso!\n\n" +
                "👤 *Profissional:* %s\n" +
                "📅 *Data:* %s\n" +
                "⏰ *Horário:* %s\n" +
                "✂️ *Serviço:* %s\n\n" +
                "Te esperamos lá!",
                agendamento.getNome(),
                agendamento.getBarbeiro(),
                agendamento.getDataAgendamento(),
                agendamento.getHorario(),
                agendamento.getServicos()
            );

            //headers http
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + whatsappToken);

            //requisição em JSON
            Map<String, Object> body = new HashMap<>();
            body.put("number", telefoneFormatado);
            body.put("message", mensagem);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            //post pra api do whats
            restTemplate.postForEntity(whatsappURL, request, String.class);
            System.out.println("Mensagem enviada para o WhatsApp de " + agendamento.getNome());

            //tratamento de erro pro agendamento nao ser cancelado caso dê falha na mensagem do whatsapp
        } catch (Exception e) {
            System.err.println("⚠️ Falha ao enviar WhatsApp: " + e.getMessage());
        }
    }

    // formatação do telefone e ddd brasileiro
    private String formatarTelefone(String telefone) {
        if (telefone == null) return "";
        
        String apenasNumeros = telefone.replaceAll("\\D", "");
        
        if (!apenasNumeros.startsWith("55")) {
            apenasNumeros = "55" + apenasNumeros;
        }
        
        return apenasNumeros;
    }

}