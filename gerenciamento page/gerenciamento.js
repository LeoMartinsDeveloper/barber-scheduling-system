const API = "http://localhost:8080";

const meses = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

document.addEventListener("DOMContentLoaded", carregarDashboard);

async function carregarDashboard() {
  mostrarDataHoje();

  try {
    const [agendamentos, barbeiros, servicos] = await Promise.all([
      buscarJson(`${API}/agendamento`),
      buscarJson(`${API}/barbeiros`),
      buscarJson(`${API}/servicos`),
    ]);

    preencherEstatisticas(agendamentos, barbeiros, servicos);
    preencherProximos(agendamentos);
  } catch (erro) {
    console.error(erro);
    document.getElementById("lista-proximos").innerHTML =
      `<p class="text-red-500">Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${API}.</p>`;
  }
}

async function buscarJson(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`Erro ao buscar ${url}`);
  return resposta.json();
}

function mostrarDataHoje() {
  const hoje = new Date();
  const texto = `Hoje é ${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}.`;
  document.getElementById("data-hoje").textContent = texto;
}

function isoHoje() {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${hoje.getFullYear()}-${mes}-${dia}`;
}

function preencherEstatisticas(agendamentos, barbeiros, servicos) {
  const hoje = isoHoje();
  const doDia = agendamentos.filter((a) => a.dataAgendamento === hoje);

  const faturamentoHoje = doDia.reduce(
    (total, a) => total + Number(a.valorTotal || 0),
    0
  );

  document.getElementById("stat-hoje").textContent = doDia.length;
  document.getElementById("stat-faturamento").textContent = formatarReal(faturamentoHoje);
  document.getElementById("stat-total").textContent = agendamentos.length;
  document.getElementById("stat-equipe").textContent =
    `${barbeiros.length} / ${servicos.length}`;
}

function preencherProximos(agendamentos) {
  const container = document.getElementById("lista-proximos");
  const hoje = isoHoje();

  // Agendamentos de hoje em diante, ordenados por data e horário
  const futuros = agendamentos
    .filter((a) => (a.dataAgendamento || "") >= hoje)
    .sort((a, b) => {
      const chaveA = `${a.dataAgendamento} ${a.horario}`;
      const chaveB = `${b.dataAgendamento} ${b.horario}`;
      return chaveA.localeCompare(chaveB);
    })
    .slice(0, 6);

  if (futuros.length === 0) {
    container.innerHTML = `<p class="text-gray-400">Nenhum agendamento futuro.</p>`;
    return;
  }

  container.innerHTML = futuros
    .map(
      (a) => `
      <div class="flex items-center justify-between border border-gray-100 rounded-2xl p-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold">
            ${(a.nome || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <p class="font-bold">${a.nome || "Cliente"}</p>
            <p class="text-sm text-gray-500">${a.servicos || ""} · ${a.barbeiro || ""}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-semibold">${formatarData(a.dataAgendamento)}</p>
          <p class="text-sm text-gray-500">${formatarHora(a.horario)}</p>
        </div>
      </div>`
    )
    .join("");
}

function formatarReal(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(iso) {
  if (!iso) return "";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarHora(hora) {
  if (!hora) return "";
  return hora.substring(0, 5);
}
