const API = "http://localhost:8080";

// Grade padrão de horários (precisa bater com a do backend)
const HORARIOS = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const listaBarbeiros = document.getElementById("lista-barbeiros-adm");
const gradeHorarios = document.getElementById("grade-horarios");
const monthYearLabel = document.getElementById("calendar-month-year");
const daysGrid = document.getElementById("calendar-days-grid");

let dataCalendario = new Date();
let valorDiaSelecionado = null;
let diaSelecionadoElement = null;
let barbeiroSelecionado = null;

document.addEventListener("DOMContentLoaded", async () => {
  renderizarHorarios();
  renderizarCalendario();

  document.getElementById("btn-prev-month").addEventListener("click", () => {
    dataCalendario.setMonth(dataCalendario.getMonth() - 1);
    renderizarCalendario();
  });
  document.getElementById("btn-next-month").addEventListener("click", () => {
    dataCalendario.setMonth(dataCalendario.getMonth() + 1);
    renderizarCalendario();
  });

  document.getElementById("btn-salvar-bloqueios").addEventListener("click", salvarBloqueios);

  await carregarBarbeiros();
});

// ---------------- Barbeiros ----------------

async function carregarBarbeiros() {
  try {
    const resposta = await fetch(`${API}/barbeiros`);
    if (!resposta.ok) throw new Error("Erro ao listar barbeiros.");
    const barbeiros = await resposta.json();

    if (barbeiros.length === 0) {
      listaBarbeiros.innerHTML =
        `<p class="text-gray-400 col-span-full text-center">Nenhum profissional cadastrado.</p>`;
      return;
    }

    listaBarbeiros.innerHTML = barbeiros
      .map(
        (b) => `
        <button data-nome="${b.nome}"
          class="card-barbeiro-adm bg-white p-4 rounded-2xl border-2 border-gray-200 flex items-center gap-4 text-left hover:border-black transition w-full">
          <img src="${b.foto || "../assets main page/homem-solo.png"}"
            alt="${b.nome}"
            class="w-16 h-16 rounded-full object-cover bg-gray-200"
            onerror="this.src='../assets main page/homem-solo.png'" />
          <div>
            <h4 class="font-bold text-gray-900">${b.nome}</h4>
            <p class="text-sm text-gray-500">${b.especialidade || ""}</p>
          </div>
        </button>`
      )
      .join("");

    listaBarbeiros.querySelectorAll(".card-barbeiro-adm").forEach((card) =>
      card.addEventListener("click", () => selecionarBarbeiro(card))
    );
  } catch (erro) {
    console.error(erro);
    listaBarbeiros.innerHTML =
      `<p class="text-red-500 col-span-full text-center">Não foi possível conectar ao servidor.</p>`;
  }
}

function selecionarBarbeiro(card) {
  listaBarbeiros.querySelectorAll(".card-barbeiro-adm").forEach((c) => {
    c.classList.remove("bg-black", "text-white", "border-black");
    c.classList.add("bg-white");
    const p = c.querySelector("p");
    if (p) p.classList.replace("text-gray-300", "text-gray-500");
    const h4 = c.querySelector("h4");
    if (h4) h4.classList.replace("text-white", "text-gray-900");
  });

  card.classList.remove("bg-white");
  card.classList.add("bg-black", "text-white", "border-black");
  const p = card.querySelector("p");
  if (p) p.classList.replace("text-gray-500", "text-gray-300");
  const h4 = card.querySelector("h4");
  if (h4) h4.classList.replace("text-gray-900", "text-white");

  barbeiroSelecionado = card.dataset.nome;
  aplicarBloqueiosSalvos();
}

// ---------------- Horários ----------------

function renderizarHorarios() {
  gradeHorarios.innerHTML = HORARIOS.map(
    (h) => `
    <button data-hora="${h}"
      class="horario-adm-item relative border border-gray-300 py-3 rounded-md text-center font-medium bg-white text-gray-900 hover:bg-gray-50 transition">
      ${h}
    </button>`
  ).join("");

  gradeHorarios.querySelectorAll(".horario-adm-item").forEach((botao) =>
    botao.addEventListener("click", () => alternarHorario(botao))
  );
}

function alternarHorario(botao) {
  botao.classList.toggle("border-red-500");
  botao.classList.toggle("bg-red-50");
  botao.classList.toggle("text-red-600");

  const iconeExistente = botao.querySelector(".fa-ban");
  if (iconeExistente) {
    iconeExistente.remove();
  } else {
    const icone = document.createElement("i");
    icone.className = "fas fa-ban text-red-600 absolute top-1 right-1 text-[10px]";
    botao.appendChild(icone);
  }
}

function resetarHorarios() {
  gradeHorarios.querySelectorAll(".horario-adm-item").forEach((botao) => {
    botao.classList.remove("border-red-500", "bg-red-50", "text-red-600");
    const icone = botao.querySelector(".fa-ban");
    if (icone) icone.remove();
  });
}

function marcarHorario(hora) {
  const botao = gradeHorarios.querySelector(`[data-hora="${hora}"]`);
  if (!botao) return;
  botao.classList.add("border-red-500", "bg-red-50", "text-red-600");
  if (!botao.querySelector(".fa-ban")) {
    const icone = document.createElement("i");
    icone.className = "fas fa-ban text-red-600 absolute top-1 right-1 text-[10px]";
    botao.appendChild(icone);
  }
}

async function aplicarBloqueiosSalvos() {
  resetarHorarios();
  if (!barbeiroSelecionado || !valorDiaSelecionado) return;

  try {
    const data = isoDiaSelecionado();
    const resposta = await fetch(
      `${API}/bloqueios/horarios?barbeiro=${encodeURIComponent(barbeiroSelecionado)}&data=${data}`
    );
    if (!resposta.ok) return;
    const horarios = await resposta.json();
    horarios.map((h) => h.substring(0, 5)).forEach(marcarHorario);
  } catch (erro) {
    console.error("Erro ao carregar bloqueios:", erro);
  }
}

// ---------------- Calendário ----------------

function isoDiaSelecionado() {
  const { ano, mes, dia } = valorDiaSelecionado;
  return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function renderizarCalendario() {
  daysGrid.innerHTML = "";
  const ano = dataCalendario.getFullYear();
  const mes = dataCalendario.getMonth();
  monthYearLabel.textContent = `${meses[mes]} ${ano}`;

  const primeiroDiaIndex = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();

  for (let i = 0; i < primeiroDiaIndex; i++) {
    daysGrid.appendChild(document.createElement("div"));
  }

  const baseInativo =
    "p-1 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition text-center aspect-square flex items-center justify-center";
  const baseAtivo =
    "p-1 text-xs font-bold text-white bg-black rounded-lg text-center aspect-square flex items-center justify-center";

  for (let dia = 1; dia <= ultimoDia; dia++) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = dia;
    botao.className = baseInativo;

    const selecionado =
      valorDiaSelecionado &&
      valorDiaSelecionado.dia === dia &&
      valorDiaSelecionado.mes === mes &&
      valorDiaSelecionado.ano === ano;

    if (selecionado) {
      botao.className = baseAtivo;
      diaSelecionadoElement = botao;
    }

    botao.addEventListener("click", () => {
      if (diaSelecionadoElement) diaSelecionadoElement.className = baseInativo;
      botao.className = baseAtivo;
      diaSelecionadoElement = botao;
      valorDiaSelecionado = { dia, mes, ano };
      aplicarBloqueiosSalvos();
    });

    daysGrid.appendChild(botao);
  }
}

// ---------------- Salvar ----------------

async function salvarBloqueios() {
  if (!barbeiroSelecionado) {
    alert("Por favor, selecione um profissional antes de salvar.");
    return;
  }
  if (!valorDiaSelecionado) {
    alert("Por favor, selecione um dia no calendário antes de salvar.");
    return;
  }

  const horariosBloqueados = [];
  gradeHorarios.querySelectorAll(".horario-adm-item").forEach((botao) => {
    if (botao.classList.contains("bg-red-50")) {
      horariosBloqueados.push(botao.dataset.hora);
    }
  });

  try {
    const resposta = await fetch(`${API}/bloqueios/horarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barbeiro: barbeiroSelecionado,
        data: isoDiaSelecionado(),
        horarios: horariosBloqueados,
      }),
    });
    if (!resposta.ok) throw new Error("Erro ao salvar bloqueios.");

    const dataFormatada = isoDiaSelecionado().split("-").reverse().join("/");
    alert(`Bloqueios salvos para ${barbeiroSelecionado} no dia ${dataFormatada}!`);
  } catch (erro) {
    console.error(erro);
    alert("Erro ao salvar os bloqueios.");
  }
}
