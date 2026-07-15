export async function salvarAgendamento(dadosAgendamento) {

    try {

        const response = await fetch("http://localhost:8080/agendamento", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(dadosAgendamento)

        });

        if (!response.ok) {
            throw new Error("Erro ao salvar agendamento.");
        }

        return await response.json();

    } catch (erro) {

        console.error("Erro:", erro);
        throw erro;

    }

}