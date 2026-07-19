function inicializarLogicaAdm() {
  const cardsBarbeiro = document.querySelectorAll(".card-barbeiro-adm");
  const horarios = document.querySelectorAll(".horario-adm-item");
  const btnDesconectar = document.getElementById("btn-desconectar");
  const btnSalvar = document.getElementById("btn-salvar-bloqueios");

  const monthYearLabel = document.getElementById("calendar-month-year");
  const daysGrid = document.getElementById("calendar-days-grid");
  const btnPrevMonth = document.getElementById("btn-prev-month");
  const btnNextMonth = document.getElementById("btn-next-month");

  let dataCalendario = new Date();
  let diaSelecionadoElement = null;
  let valorDiaSelecionado = null;

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  function resetarHorarios() {
    horarios.forEach((botao) => {
      botao.classList.remove("border-red-500", "bg-red-50", "text-red-600");
      const iconeExistente = botao.querySelector(".fa-ban");
      if (iconeExistente) {
        iconeExistente.remove();
      }
    });
  }

  function renderizarCalendario() {
    if (!daysGrid || !monthYearLabel) return;
    daysGrid.innerHTML = "";

    const ano = dataCalendario.getFullYear();
    const mes = dataCalendario.getMonth();

    monthYearLabel.textContent = `${meses[mes]} ${ano}`;

    const primeiroDiaIndex = new Date(ano, mes, 1).getDay();
    const ultimoDiaMesa = new Date(ano, mes + 1, 0).getDate();

    for (let i = 0; i < primeiroDiaIndex; i++) {
      const vazio = document.createElement("div");
      daysGrid.appendChild(vazio);
    }

    for (let dia = 1; dia <= ultimoDiaMesa; dia++) {
      const botaoDia = document.createElement("button");
      botaoDia.type = "button";
      botaoDia.textContent = dia;
      botaoDia.className =
        "p-1 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition text-center aspect-square flex items-center justify-center";

      const hoje = new Date();
      if (
        dia === hoje.getDate() &&
        mes === hoje.getMonth() &&
        ano === hoje.getFullYear() &&
        !valorDiaSelecionado
      ) {
        botaoDia.classList.add("bg-gray-200");
      }

      if (
        valorDiaSelecionado &&
        valorDiaSelecionado.dia === dia &&
        valorDiaSelecionado.mes === mes &&
        valorDiaSelecionado.ano === ano
      ) {
        botaoDia.className =
          "p-1 text-xs font-bold text-white bg-black rounded-lg text-center aspect-square flex items-center justify-center";
        diaSelecionadoElement = botaoDia;
      }

      botaoDia.addEventListener("click", () => {
        if (diaSelecionadoElement) {
          diaSelecionadoElement.className =
            "p-1 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition text-center aspect-square flex items-center justify-center";
          const hojeInterno = new Date();
          if (
            Number(diaSelecionadoElement.textContent) ===
              hojeInterno.getDate() &&
            mes === hojeInterno.getMonth() &&
            ano === hojeInterno.getFullYear()
          ) {
            diaSelecionadoElement.classList.add("bg-gray-200");
          }
        }

        botaoDia.className =
          "p-1 text-xs font-bold text-white bg-black rounded-lg text-center aspect-square flex items-center justify-center";
        diaSelecionadoElement = botaoDia;
        valorDiaSelecionado = { dia, mes, ano };

        resetarHorarios();
      });

      daysGrid.appendChild(botaoDia);
    }
  }

  if (btnPrevMonth && btnNextMonth) {
    btnPrevMonth.addEventListener("click", () => {
      dataCalendario.setMonth(dataCalendario.getMonth() - 1);
      renderizarCalendario();
    });

    btnNextMonth.addEventListener("click", () => {
      dataCalendario.setMonth(dataCalendario.getMonth() + 1);
      renderizarCalendario();
    });
  }

  cardsBarbeiro.forEach((card) => {
    card.addEventListener("click", () => {
      const isSelected = card.classList.contains("bg-black");

      if (isSelected) {
        card.classList.remove("bg-black", "text-white", "border-black");
        card.classList.add("bg-white");

        const textoP = card.querySelector("p");
        if (textoP) {
          textoP.classList.replace("text-gray-300", "text-gray-500");
        }

        const textoH4 = card.querySelector("h4");
        if (textoH4) {
          textoH4.classList.replace("text-white", "text-gray-900");
        }
      } else {
        cardsBarbeiro.forEach((c) => {
          c.classList.remove("bg-black", "text-white", "border-black");
          c.classList.add("bg-white");

          const textoP = c.querySelector("p");
          if (textoP) {
            textoP.classList.replace("text-gray-300", "text-gray-500");
          }

          const textoH4 = c.querySelector("h4");
          if (textoH4) {
            textoH4.classList.replace("text-white", "text-gray-900");
          }
        });

        card.classList.remove("bg-white");
        card.classList.add("bg-black", "text-white", "border-black");

        const textoP = card.querySelector("p");
        if (textoP) {
          textoP.classList.replace("text-gray-500", "text-gray-300");
        }

        const textoH4 = card.querySelector("h4");
        if (textoH4) {
          textoH4.classList.replace("text-gray-900", "text-white");
        }
      }

      resetarHorarios();
    });
  });

  horarios.forEach((botao) => {
    botao.classList.add("relative");

    botao.addEventListener("click", () => {
      botao.classList.toggle("border-red-500");
      botao.classList.toggle("bg-red-50");
      botao.classList.toggle("text-red-600");

      const iconeExistente = botao.querySelector(".fa-ban");

      if (iconeExistente) {
        iconeExistente.remove();
      } else {
        const icone = document.createElement("i");
        icone.className =
          "fas fa-ban text-red-600 absolute top-1 right-1 text-[10px]";
        botao.appendChild(icone);
      }
    });
  });

  if (btnSalvar) {
    btnSalvar.addEventListener("click", () => {
      const barbeiroSelecionado = document.querySelector(
        ".card-barbeiro-adm.bg-black h4",
      );

      if (!barbeiroSelecionado) {
        alert("Por favor, selecione um profissional antes de salvar.");
        return;
      }

      if (!valorDiaSelecionado) {
        alert("Por favor, selecione um dia no calendário antes de salvar.");
        return;
      }

      const nomeBarbeiro = barbeiroSelecionado.textContent.trim();
      const horáriosBloqueados = [];

      horarios.forEach((botao) => {
        if (botao.classList.contains("bg-red-50")) {
          horáriosBloqueados.push(botao.textContent.trim());
        }
      });

      if (horáriosBloqueados.length === 0) {
        alert("Por favor, selecione ao menos um horário antes de salvar.");
        return;
      }

      const dataFormatada = `${valorDiaSelecionado.dia}/${valorDiaSelecionado.mes + 1}/${valorDiaSelecionado.ano}`;

      console.log(`Profissional: ${nomeBarbeiro}`);
      console.log(`Data: ${dataFormatada}`);
      console.log(`Horários Bloqueados:`, horáriosBloqueados);

      alert(`Alterações salvas para ${nomeBarbeiro} no dia ${dataFormatada}!`);
    });
  }

  if (btnDesconectar) {
    btnDesconectar.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  renderizarCalendario();
}

document.addEventListener("DOMContentLoaded", inicializarLogicaAdm);
