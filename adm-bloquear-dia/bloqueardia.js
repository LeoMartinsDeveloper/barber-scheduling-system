const API = "http://localhost:8080/bloqueios";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const grade = document.getElementById("calendario-bloqueio");
const tituloMes = document.getElementById("titulo-mes");
const listaBloqueados = document.getElementById("lista-dias-bloqueados");

let dataCalendario = new Date();
// Mapa: "yyyy-mm-dd" -> id do bloqueio (para desbloquear)
let diasBloqueados = {};

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("mes-anterior").addEventListener("click", () => {
    dataCalendario.setMonth(dataCalendario.getMonth() - 1);
    renderizarCalendario();
  });
  document.getElementById("mes-proximo").addEventListener("click", () => {
    dataCalendario.setMonth(dataCalendario.getMonth() + 1);
    renderizarCalendario();
  });

  await carregarBloqueios();
});

async function carregarBloqueios() {
  try {
    const resposta = await fetch(`${API}/dias`);
    if (!resposta.ok) throw new Error("Erro ao carregar dias bloqueados.");
    const dados = await resposta.json();

    diasBloqueados = {};
    dados.forEach((b) => {
      diasBloqueados[b.data] = b.id;
    });

    renderizarCalendario();
    renderizarLista();
  } catch (erro) {
    console.error(erro);
    listaBloqueados.innerHTML =
      `<p class="text-red-500">Não foi possível conectar ao servidor.</p>`;
    renderizarCalendario();
  }
}

function iso(ano, mes, dia) {
  return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function renderizarCalendario() {
  const ano = dataCalendario.getFullYear();
  const mes = dataCalendario.getMonth();

  tituloMes.textContent = `${meses[mes]} de ${ano}`;
  grade.innerHTML = "";

  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  for (let i = 0; i < primeiroDiaSemana; i++) {
    grade.appendChild(document.createElement("div"));
  }

  for (let dia = 1; dia <= totalDias; dia++) {
    const chave = iso(ano, mes, dia);
    const bloqueado = chave in diasBloqueados;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = dia;
    botao.className = bloqueado
      ? "dia-bloqueio h-16 rounded-2xl border bg-black text-white transition"
      : "dia-bloqueio h-16 rounded-2xl border hover:border-black transition";

    botao.addEventListener("click", () => alternarBloqueio(chave));
    grade.appendChild(botao);
  }
}

async function alternarBloqueio(chave) {
  try {
    if (chave in diasBloqueados) {
      await fetch(`${API}/dias/${diasBloqueados[chave]}`, { method: "DELETE" });
    } else {
      await fetch(`${API}/dias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: chave }),
      });
    }
    await carregarBloqueios();
  } catch (erro) {
    console.error(erro);
    alert("Erro ao atualizar o bloqueio.");
  }
}

function renderizarLista() {
  const chaves = Object.keys(diasBloqueados).sort();

  if (chaves.length === 0) {
    listaBloqueados.innerHTML = `<p class="text-gray-400">Nenhum dia bloqueado.</p>`;
    return;
  }

  listaBloqueados.innerHTML = chaves
    .map((chave) => {
      const [ano, mes, dia] = chave.split("-");
      return `
        <div class="bg-white rounded-2xl border border-gray-200 p-5 flex justify-between items-center">
          <div>
            <h3 class="font-bold text-lg">${dia}/${mes}/${ano}</h3>
            <p class="text-gray-500 text-sm">Nenhum agendamento permitido.</p>
          </div>
          <button data-chave="${chave}"
            class="btn-desbloquear text-red-500 hover:text-red-700 transition">
            <i class="fas fa-trash"></i>
          </button>
        </div>`;
    })
    .join("");

  listaBloqueados.querySelectorAll(".btn-desbloquear").forEach((btn) =>
    btn.addEventListener("click", () => alternarBloqueio(btn.dataset.chave))
  );
}
