const URL = "http://localhost:8080/barbeiros";

export async function listarBarbeiros() {
    const response = await fetch(URL);

    if (!response.ok) {
        throw new Error("Erro ao listar barbeiros.");
    }

    return await response.json();
}

export async function buscarBarbeiro(id) {
    const response = await fetch(`${URL}/${id}`);

    if (!response.ok) {
        throw new Error("Erro ao buscar barbeiro.");
    }

    return await response.json();
}

export async function criarBarbeiro(barbeiro) {
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(barbeiro)
    });

    if (!response.ok) {
        throw new Error("Erro ao criar barbeiro.");
    }

    return await response.json();
}

export async function atualizarBarbeiro(id, barbeiro) {
    const response = await fetch(`${URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(barbeiro)
    });

    if (!response.ok) {
        throw new Error("Erro ao atualizar barbeiro.");
    }

    return await response.json();
}

export async function excluirBarbeiro(id) {
    const response = await fetch(`${URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Erro ao excluir barbeiro.");
    }
}