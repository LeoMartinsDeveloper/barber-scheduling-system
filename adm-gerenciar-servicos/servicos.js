import {
    listarServicos,
    salvarServico,
    excluirServico
} from "./api-servicos.js";

const container = document.getElementById("lista-servicos");

document.addEventListener("DOMContentLoaded", () => {
    carregarServicos();
});

async function carregarServicos() {

    container.innerHTML = "";

    try {

        const servicos = await listarServicos();

        servicos.forEach(servico => {
            criarCard(servico);
        });

    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar serviços.");
    }

}

function criarCard(servico) {

    const card = document.createElement("div");

    card.className =
        "bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4";

    card.innerHTML = `

        <div>
            <label class="text-sm font-semibold">Nome</label>

            <input
                class="nome mt-1 w-full border rounded-lg p-2"
                value="${servico.nome}">
        </div>

        <div>
            <label class="text-sm font-semibold">Descrição</label>

            <textarea
                class="descricao mt-1 w-full border rounded-lg p-2"
                rows="3">${servico.descricao}</textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">

            <div>

                <label class="text-sm font-semibold">Preço</label>

                <input
                    type="number"
                    class="preco mt-1 w-full border rounded-lg p-2"
                    value="${servico.preco}">

            </div>

            <div>

                <label class="text-sm font-semibold">Duração (min)</label>

                <input
                    type="number"
                    class="duracao mt-1 w-full border rounded-lg p-2"
                    value="${servico.duracao}">

            </div>

        </div>

        <div class="flex justify-end gap-3 mt-2">

            <button
                class="btn-excluir bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700">

                Excluir

            </button>

            <button
                class="btn-salvar bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800">

                Salvar

            </button>

        </div>

    `;

    const btnSalvar = card.querySelector(".btn-salvar");

    btnSalvar.addEventListener("click", async () => {

        const dados = {

            id: servico.id,

            nome: card.querySelector(".nome").value,

            descricao: card.querySelector(".descricao").value,

            preco: Number(card.querySelector(".preco").value),

            duracao: Number(card.querySelector(".duracao").value)

        };

        try {

            await salvarServico(dados);

            alert("Serviço atualizado!");

        } catch (erro) {

            console.error(erro);

            alert("Erro ao atualizar serviço.");

        }

    });

    const btnExcluir = card.querySelector(".btn-excluir");

    btnExcluir.addEventListener("click", async () => {

        if (!confirm("Deseja realmente excluir este serviço?")) {
            return;
        }

        try {

            await excluirServico(servico.id);

            card.remove();

        } catch (erro) {

            console.error(erro);

            alert("Erro ao excluir serviço.");

        }

    });

    container.appendChild(card);

}