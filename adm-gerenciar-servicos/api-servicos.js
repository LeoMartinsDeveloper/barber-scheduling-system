const URL = "http://localhost:8080/servicos";

export async function listarServicos() {

    const resposta = await fetch(URL);

    if (!resposta.ok) {
        throw new Error("Erro ao buscar serviços.");
    }

    return await resposta.json();
}

export async function salvarServico(servico) {

    const resposta = await fetch(`${URL}/${servico.id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(servico)

    });

    if (!resposta.ok) {
        throw new Error("Erro ao atualizar serviço.");
    }

    return await resposta.json();
}

export async function excluirServico(id) {

    const resposta = await fetch(`${URL}/${id}`, {

        method: "DELETE"

    });

    if (!resposta.ok) {
        throw new Error("Erro ao excluir serviço.");
    }
}

export async function criarServico(servico) {

    const resposta = await fetch(URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(servico)

    });

    if (!resposta.ok) {
        throw new Error("Erro ao cadastrar serviço.");
    }

    return await resposta.json();
}