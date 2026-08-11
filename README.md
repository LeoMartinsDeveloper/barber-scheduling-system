# WeBarber

Sistema de agendamento para barbearia. O cliente escolhe o serviço, o profissional e o horário pelo site, e existe um painel administrativo pra gerenciar tudo por trás.

## O que dá pra fazer

- Agendar horário pelo site escolhendo serviço, barbeiro, dia e hora
- Os horários já ocupados aparecem bloqueados na hora de marcar
- Confirmação do agendamento por e-mail e WhatsApp
- Painel administrativo (com login) para:
  - acompanhar e gerenciar os agendamentos
  - cadastrar e editar barbeiros e serviços
  - bloquear dias ou horários específicos da agenda

## Tecnologias

- Front-end: HTML, Tailwind CSS e JavaScript
- Back-end: Java com Spring Boot
- Banco de dados: PostgreSQL (Neon)

## Como rodar

### Back-end

Dentro da pasta `gerenciamento`:

```bash
./mvnw spring-boot:run
```

As credenciais do banco e do e-mail ficam em `src/main/resources/application-local.properties`, que **não vai pro Git**. Tem um arquivo `application-local.properties.example` de modelo — é só copiar, renomear e preencher com os seus dados.

### Front-end

O site é estático, mas usa módulos JavaScript, então precisa ser servido por HTTP (abrir o arquivo direto no navegador não funciona). Um jeito rápido:

```bash
python -m http.server 5500
```

Depois é só abrir `http://localhost:5500/index.html`.

## Organização das pastas

- `index.html` e `main.js` — site principal
- `agendamento page/` — modal de agendamento
- `login page/` — tela de login do admin
- `gerenciamento page/` e as pastas `adm-*` — telas do painel administrativo
- `gerenciamento/` — API em Spring Boot
