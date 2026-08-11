const API = "http://localhost:8080";

const lista = document.getElementById("lista-agendamentos");
const filtroCliente = document.getElementById("filtro-cliente");
const filtroBarbeiro = document.getElementById("filtro-barbeiro");
const filtroData = document.getElementById("filtro-data");

const modal = document.getElementById("modal-editar");
const formEditar = document.getElementById("form-editar");

let agendamentos = [];

document.addEventListener("DOMContentLoaded", async () => {
  await carregarBarbeiros();
  await carregarAgendamentos();

  filtroCliente.addEventListener("input", renderizar);
  filtroBarbeiro.addEventListener("change", renderizar);
  filtroData.addEventListener("change", renderizar);

  document.getElementById("fechar-modal-editar").addEventListener("click", fecharModal);
  document.getElementById("cancelar-modal-editar").addEventListener("click", fecharModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();
  });

  formEditar.addEventListener("submit", salvarEdicao);
});

async function carregarBarbeiros() {
  try {
    const resposta = await fetch(`${API}/barbeiros`);
    if (!resposta.ok) return;
    const barbeiros = await resposta.json();
    barbeiros.forEach((b) => {
      const opt = document.createElement("option");
      opt.value = b.nome;
      opt.textContent = b.nome;
      filtroBarbeiro.appendChild(opt);
    });
  } catch (erro) {
    console.error("Erro ao carregar barbeiros:", erro);
  }
}

async function carregarAgendamentos() {
  try {
    const resposta = await fetch(`${API}/agendamento`);
    if (!resposta.ok) throw new Error("Erro ao listar agendamentos.");
    agendamentos = await resposta.json();
    renderizar();
  } catch (erro) {
    console.error(erro);
    lista.innerHTML = `<p class="text-red-500">Não foi possível conectar ao servidor (${API}).</p>`;
  }
}

function renderizar() {
  const termo = filtroCliente.value.trim().toLowerCase();
  const barbeiro = filtroBarbeiro.value;
  const data = filtroData.value;

  const filtrados = agendamentos
    .filter((a) => !termo || (a.nome || "").toLowerCase().includes(termo))
    .filter((a) => !barbeiro || a.barbeiro === barbeiro)
    .filter((a) => !data || a.dataAgendamento === data)
    .sort((a, b) =>
      `${b.dataAgendamento} ${b.horario}`.localeCompare(`${a.dataAgendamento} ${a.horario}`)
    );

  if (filtrados.length === 0) {
    lista.innerHTML = `<p class="text-gray-400">Nenhum agendamento encontrado.</p>`;
    return;
  }

  lista.innerHTML = filtrados.map(criarCard).join("");

  lista.querySelectorAll(".btn-editar").forEach((btn) =>
    btn.addEventListener("click", () => abrirModal(Number(btn.dataset.id)))
  );
  lista.querySelectorAll(".btn-cancelar").forEach((btn) =>
    btn.addEventListener("click", () => cancelar(Number(btn.dataset.id)))
  );
}

function criarCard(a) {
  return `
    <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-xl font-bold">${a.nome || "Cliente"}</h2>
          <p class="text-gray-500 text-sm">Agendamento confirmado</p>
        </div>
        <span class="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
          Confirmado
        </span>
      </div>

      <div class="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>Serviços:</strong> ${a.servicos || "-"}</p>
          <p><strong>Barbeiro:</strong> ${a.barbeiro || "-"}</p>
          <p><strong>Valor:</strong> ${formatarReal(a.valorTotal)}</p>
        </div>
        <div>
          <p><strong>Data:</strong> ${formatarData(a.dataAgendamento)}</p>
          <p><strong>Horário:</strong> ${formatarHora(a.horario)}</p>
          <p><strong>Telefone:</strong> ${a.telefone || "-"}</p>
        </div>
      </div>

      <div class="mt-4">
        <p class="text-sm"><strong>Email:</strong> ${a.email || "-"}</p>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button data-id="${a.id}"
          class="btn-editar bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition flex items-center gap-2">
          <i class="fas fa-pen"></i> Editar
        </button>
        <button data-id="${a.id}"
          class="btn-cancelar bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition flex items-center gap-2">
          <i class="fas fa-trash"></i> Cancelar
        </button>
      </div>
    </div>`;
}

function abrirModal(id) {
  const a = agendamentos.find((x) => x.id === id);
  if (!a) return;

  document.getElementById("edit-id").value = a.id;
  document.getElementById("edit-nome").value = a.nome || "";
  document.getElementById("edit-email").value = a.email || "";
  document.getElementById("edit-telefone").value = a.telefone || "";
  document.getElementById("edit-barbeiro").value = a.barbeiro || "";
  document.getElementById("edit-servicos").value = a.servicos || "";
  document.getElementById("edit-data").value = a.dataAgendamento || "";
  document.getElementById("edit-horario").value = formatarHora(a.horario);
  document.getElementById("edit-valor").value = a.valorTotal ?? "";

  modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function fecharModal() {
  modal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

async function salvarEdicao(e) {
  e.preventDefault();

  const id = document.getElementById("edit-id").value;
  const dados = {
    nome: document.getElementById("edit-nome").value.trim(),
    email: document.getElementById("edit-email").value.trim(),
    telefone: document.getElementById("edit-telefone").value.trim(),
    barbeiro: document.getElementById("edit-barbeiro").value.trim(),
    servicos: document.getElementById("edit-servicos").value.trim(),
    dataAgendamento: document.getElementById("edit-data").value,
    horario: document.getElementById("edit-horario").value,
    valorTotal: Number(document.getElementById("edit-valor").value || 0),
  };

  try {
    const resposta = await fetch(`${API}/agendamento/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!resposta.ok) throw new Error("Erro ao atualizar agendamento.");
    fecharModal();
    await carregarAgendamentos();
  } catch (erro) {
    console.error(erro);
    alert("Erro ao salvar as alterações.");
  }
}

async function cancelar(id) {
  if (!confirm("Deseja realmente cancelar este agendamento?")) return;

  try {
    const resposta = await fetch(`${API}/agendamento/${id}`, { method: "DELETE" });
    if (!resposta.ok) throw new Error("Erro ao cancelar agendamento.");
    await carregarAgendamentos();
  } catch (erro) {
    console.error(erro);
    alert("Erro ao cancelar o agendamento.");
  }
}

function formatarReal(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(iso) {
  if (!iso) return "-";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarHora(hora) {
  if (!hora) return "";
  return hora.substring(0, 5);
}
