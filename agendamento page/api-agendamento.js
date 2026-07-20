const URL = "http://localhost:8080/agendamento";

// Salva um novo agendamento
export async function salvarAgendamento(dados) {

    const resposta = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
        throw new Error("Erro ao salvar agendamento.");
    }

    return await resposta.json();
}

// Busca os horários ocupados de um barbeiro em uma data
export async function buscarHorariosOcupados(barbeiro, data) {

    const resposta = await fetch(
        `${URL}/ocupados?barbeiro=${encodeURIComponent(barbeiro)}&data=${data}`
    );

    if (!resposta.ok) {
        throw new Error("Erro ao buscar horários ocupados.");
    }

    const horarios = await resposta.json();

    // Converte "08:00:00" para "08:00"
    return horarios.map(horario => horario.substring(0, 5));
}

// Lista todos os agendamentos
export async function listarAgendamentos() {

    const resposta = await fetch(URL);

    if (!resposta.ok) {
        throw new Error("Erro ao listar agendamentos.");
    }

    return await resposta.json();
}

// Exclui um agendamento
export async function excluirAgendamento(id) {

    const resposta = await fetch(`${URL}/${id}`, {
        method: "DELETE"
    });

    if (!resposta.ok) {
        throw new Error("Erro ao excluir agendamento.");
    }
}

// Atualiza um agendamento
export async function atualizarAgendamento(id, dados) {

    const resposta = await fetch(`${URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
        throw new Error("Erro ao atualizar agendamento.");
    }

    return await resposta.json();
}