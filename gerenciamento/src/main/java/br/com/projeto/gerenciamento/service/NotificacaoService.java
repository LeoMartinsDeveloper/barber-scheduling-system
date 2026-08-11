package br.com.projeto.gerenciamento.service;

import br.com.projeto.gerenciamento.model.Agendamento;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    // Endereço que aparece como remetente dos e-mails (mesmo usuário do SMTP)
    @Value("${spring.mail.username:}")
    private String remetenteEmail;

    // ---- Configuração do WhatsApp (Evolution API por padrão) ----
    // Liga/desliga o envio de WhatsApp. Fica desligado em dev para não
    // disparar requisições contra um endpoint que ainda não existe.
    @Value("${whatsapp.api.enabled:false}")
    private boolean whatsappHabilitado;

    // URL base da instância da Evolution API. Ex: https://minha-evolution.com
    @Value("${whatsapp.api.url:http://localhost:8081}")
    private String whatsappUrlBase;

    // Nome da instância criada na Evolution API
    @Value("${whatsapp.api.instance:webarber}")
    private String whatsappInstancia;

    // Chave de API (header "apikey" na Evolution API)
    @Value("${whatsapp.api.token:}")
    private String whatsappToken;

    private static final DateTimeFormatter FORMATO_DATA =
            DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FORMATO_HORA =
            DateTimeFormatter.ofPattern("HH:mm");

    public void enviarConfirmacoes(Agendamento agendamento) {
        enviarEmail(agendamento);
        enviarWhatsApp(agendamento);
    }

    private void enviarEmail(Agendamento agendamento) {
        if (agendamento.getEmail() == null || agendamento.getEmail().isBlank()) {
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            if (remetenteEmail != null && !remetenteEmail.isBlank()) {
                message.setFrom(remetenteEmail);
            }

            message.setTo(agendamento.getEmail());
            message.setSubject("WeBarber - Horário Confirmado!");
            message.setText(
                "Olá " + agendamento.getNome() + ",\n\n" +
                "Seu agendamento na WeBarber foi confirmado com sucesso!\n\n" +
                "Profissional: " + agendamento.getBarbeiro() + "\n" +
                "Serviço(s): " + agendamento.getServicos() + "\n" +
                "Data: " + formatarData(agendamento) + "\n" +
                "Horário: " + formatarHora(agendamento) + "\n" +
                "Valor total: " + formatarValor(agendamento.getValorTotal()) + "\n\n" +
                "Te esperamos lá!\n\n" +
                "Equipe WeBarber"
            );

            mailSender.send(message);
            System.out.println("E-mail de confirmação enviado para " + agendamento.getEmail());
        } catch (Exception e) {
            // Uma falha de e-mail não deve cancelar o agendamento já salvo.
            System.err.println("Erro ao enviar e-mail: " + e.getMessage());
        }
    }

    private void enviarWhatsApp(Agendamento agendamento) {
        if (!whatsappHabilitado) {
            System.out.println("Envio de WhatsApp desabilitado (whatsapp.api.enabled=false).");
            return;
        }

        if (agendamento.getTelefone() == null || agendamento.getTelefone().isBlank()) {
            return;
        }

        try {
            // Formata o número para o padrão internacional: 5534999999999
            String telefoneFormatado = formatarTelefone(agendamento.getTelefone());

            String mensagem = String.format(
                "Olá *%s*! Seu agendamento na *WeBarber* foi confirmado com sucesso!%n%n" +
                "👤 *Profissional:* %s%n" +
                "📅 *Data:* %s%n" +
                "⏰ *Horário:* %s%n" +
                "✂️ *Serviço:* %s%n%n" +
                "Te esperamos lá!",
                agendamento.getNome(),
                agendamento.getBarbeiro(),
                formatarData(agendamento),
                formatarHora(agendamento),
                agendamento.getServicos()
            );

            // Endpoint padrão da Evolution API para envio de texto
            String endpoint = whatsappUrlBase.replaceAll("/+$", "")
                    + "/message/sendText/" + whatsappInstancia;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            // Evolution API autentica pelo header "apikey"
            headers.set("apikey", whatsappToken);

            Map<String, Object> body = new HashMap<>();
            body.put("number", telefoneFormatado);
            body.put("text", mensagem);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            restTemplate.postForEntity(endpoint, request, String.class);
            System.out.println("Mensagem de WhatsApp enviada para " + agendamento.getNome());
        } catch (Exception e) {
            // Falha no WhatsApp também não deve cancelar o agendamento.
            System.err.println("⚠️ Falha ao enviar WhatsApp: " + e.getMessage());
        }
    }

    private String formatarData(Agendamento agendamento) {
        return agendamento.getDataAgendamento() == null
                ? ""
                : agendamento.getDataAgendamento().format(FORMATO_DATA);
    }

    private String formatarHora(Agendamento agendamento) {
        return agendamento.getHorario() == null
                ? ""
                : agendamento.getHorario().format(FORMATO_HORA);
    }

    private String formatarValor(BigDecimal valor) {
        if (valor == null) {
            return "R$ 0,00";
        }
        return "R$ " + valor.toString().replace(".", ",");
    }

    // Garante DDI brasileiro (55) e mantém apenas dígitos
    private String formatarTelefone(String telefone) {
        if (telefone == null) return "";

        String apenasNumeros = telefone.replaceAll("\\D", "");

        if (!apenasNumeros.startsWith("55")) {
            apenasNumeros = "55" + apenasNumeros;
        }

        return apenasNumeros;
    }
}
