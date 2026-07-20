import {
    listarBarbeiros,
    criarBarbeiro,
    atualizarBarbeiro,
    excluirBarbeiro
} from "./api-barbeiros.js";

const listaBarbeiros = document.getElementById("lista-barbeiros");
const btnNovoBarbeiro = document.getElementById("btn-novo-barbeiro");

document.addEventListener("DOMContentLoaded", carregarBarbeiros);

btnNovoBarbeiro.addEventListener("click", async () => {

    const novoBarbeiro = {
        nome: "Novo barbeiro",
        descricao: "",
        telefone: "",
        especialidade: "",
        status: "ATIVO",
        foto: "../assets main page/default-user.png"
    };

    await criarBarbeiro(novoBarbeiro);

    carregarBarbeiros();
});

async function carregarBarbeiros() {

    listaBarbeiros.innerHTML = "";

    const barbeiros = await listarBarbeiros();

    barbeiros.forEach(barbeiro => {

        listaBarbeiros.innerHTML += `
        <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">

            <div class="flex items-center gap-5 mb-8">

                <img
                    src="${barbeiro.foto}"
                    class="w-24 h-24 rounded-full object-cover border-2 border-gray-200">

                <div>
                    <h2 class="text-2xl font-bold">${barbeiro.nome}</h2>
                    <p class="text-gray-500">${barbeiro.especialidade}</p>
                </div>

            </div>

            <div class="grid md:grid-cols-2 gap-5">

                <div>
                    <label class="block text-sm font-semibold mb-2">Nome</label>
                    <input
                        id="nome-${barbeiro.id}"
                        type="text"
                        value="${barbeiro.nome}"
                        class="w-full border border-gray-300 rounded-xl px-4 py-3">
                </div>

                <div>
                    <label class="block text-sm font-semibold mb-2">Especialidade</label>
                    <input
                        id="especialidade-${barbeiro.id}"
                        type="text"
                        value="${barbeiro.especialidade}"
                        class="w-full border border-gray-300 rounded-xl px-4 py-3">
                </div>

                <div class="md:col-span-2">
                    <label class="block text-sm font-semibold mb-2">Descrição</label>
                    <textarea
                        id="descricao-${barbeiro.id}"
                        rows="4"
                        class="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none">${barbeiro.descricao}</textarea>
                </div>

                <div>
                    <label class="block text-sm font-semibold mb-2">Telefone</label>
                    <input
                        id="telefone-${barbeiro.id}"
                        type="text"
                        value="${barbeiro.telefone}"
                        class="w-full border border-gray-300 rounded-xl px-4 py-3">
                </div>

                <div>
                    <label class="block text-sm font-semibold mb-2">Status</label>

                    <select
                        id="status-${barbeiro.id}"
                        class="w-full border border-gray-300 rounded-xl px-4 py-3">

                        <option value="ATIVO" ${barbeiro.status === "ATIVO" ? "selected" : ""}>Ativo</option>
                        <option value="FERIAS" ${barbeiro.status === "FERIAS" ? "selected" : ""}>Férias</option>
                        <option value="LICENCA" ${barbeiro.status === "LICENCA" ? "selected" : ""}>Licença</option>
                        <option value="DESATIVADO" ${barbeiro.status === "DESATIVADO" ? "selected" : ""}>Desativado</option>

                    </select>

                </div>

            </div>

            <div class="flex flex-wrap gap-3 mt-8">

                <button
                    class="btn-salvar flex-1 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
                    data-id="${barbeiro.id}">

                    <i class="fas fa-save mr-2"></i>
                    Salvar alterações

                </button>

                <button
                    class="btn-excluir px-6 border border-red-400 text-red-500 rounded-xl hover:bg-red-50 transition"
                    data-id="${barbeiro.id}">

                    <i class="fas fa-trash"></i>

                </button>

            </div>

        </div>
        `;
    });

    adicionarEventos();
}

function adicionarEventos() {

    document.querySelectorAll(".btn-salvar").forEach(botao => {

        botao.addEventListener("click", async () => {

            const id = botao.dataset.id;

            await atualizarBarbeiro(id, {

                nome: document.getElementById(`nome-${id}`).value,
                especialidade: document.getElementById(`especialidade-${id}`).value,
                descricao: document.getElementById(`descricao-${id}`).value,
                telefone: document.getElementById(`telefone-${id}`).value,
                status: document.getElementById(`status-${id}`).value,
                foto: "../assets main page/default-user.png"

            });

            alert("Barbeiro atualizado com sucesso!");

        });

    });

    document.querySelectorAll(".btn-excluir").forEach(botao => {

        botao.addEventListener("click", async () => {

            if (!confirm("Deseja excluir este barbeiro?")) {
                return;
            }

            await excluirBarbeiro(botao.dataset.id);

            carregarBarbeiros();

        });

    });

}