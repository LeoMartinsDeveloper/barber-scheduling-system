import { salvarAgendamento } from "./notificacao.js";

let servicosSelecionados = [];


export function inicializarLogicaModal() {

  const resumoServicos = document.getElementById("resumo-servicos");
  const totalServicos = document.getElementById("total-servicos");

  const modal = document.getElementById("modal-agendamento");
  const closeModalBtn = document.getElementById("fechar-modal-agendamento");
  const openModalButtons = document.querySelectorAll('a[href="#appointment"]');
  const botaoDia = document.querySelectorAll(".calendar-day");
  const botaoServicos = document.querySelectorAll(".botao-pacote");
  const botaoBarbeiro = document.querySelectorAll(".botao-barbeiro");
  const botaoHorario = document.querySelectorAll(".botao-horario");
  const btnConfirmar = document.getElementById("btn-confirmar-agendamento");

  function resetarModal() {
    botaoDia.forEach((btn) => {
      btn.classList.remove("bg-black", "text-white");
    });

    botaoServicos.forEach((btn) => {
      btn.classList.remove("bg-black", "text-white");
      btn.classList.add("bg-white");
      const descricao = btn.querySelector("p");
      if (descricao) {
        descricao.classList.remove("text-white");
        descricao.classList.add("text-gray-500");
      }
      const icone = btn.querySelector("img, svg");
      if (icone) {
        icone.classList.remove("invert");
      }
    });

    botaoBarbeiro.forEach((btn) => {
      btn.classList.remove("bg-black", "text-white");
      btn.classList.add("bg-white");
      const cargo = btn.querySelector("p");
      if (cargo) {
        cargo.classList.remove("text-white");
        cargo.classList.add("text-gray-500");
      }
    });

    botaoHorario.forEach((btn) => {
      btn.classList.remove("bg-black", "text-white");
      btn.classList.add("bg-white");
    });

    servicosSelecionados = [];

    console.log(servicosSelecionados);  

    atualizarResumo();

    console.log(servicosSelecionados);  
  }

  openModalButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
      resetarModal();
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
        resetarModal();
      }
    });
  }

  botaoDia.forEach((button) => {
    button.addEventListener("click", () => {
      botaoDia.forEach((btn) => {
        btn.classList.remove("bg-black", "text-white");
      });
      button.classList.add("bg-black", "text-white");

      atualizarHorariosDisponiveis();
    });
  });

  botaoServicos.forEach((button) => {

    button.addEventListener("click", () => {

      const id = button.dataset.id;
      const nome = button.dataset.nome;
      const preco = Number(button.dataset.preco);

      // Se selecionou o pacote completo
      if (id === "4") {

          // Limpa todos os serviços selecionados
          servicosSelecionados = [];

          // Remove o destaque de todos os cards
          botaoServicos.forEach(btn => {
              btn.classList.remove("bg-black", "text-white");
              btn.classList.add("bg-white");

              const descricao = btn.querySelector("p");
              if (descricao) {
                  descricao.classList.remove("text-white");
                  descricao.classList.add("text-gray-500");
              }

              const icone = btn.querySelector("img, svg");
              if (icone) {
                  icone.classList.remove("invert");
              }
          });
      }

      const indice = servicosSelecionados.findIndex(
        servico => servico.id === id
      );

      if (indice >= 0) {

        servicosSelecionados.splice(indice, 1);

        button.classList.remove("bg-black", "text-white");
        button.classList.add("bg-white");

        const descricao = button.querySelector("p");

        if (descricao) {
          descricao.classList.remove("text-white");
          descricao.classList.add("text-gray-500");
        }

        const icone = button.querySelector("img, svg");

        if (icone) {
          icone.classList.remove("invert");
        }

      } else {

        // Se algum pacote completo já estava selecionado e o usuário escolheu outro serviço,
        // remove o pacote completo.
        servicosSelecionados = servicosSelecionados.filter(servico => servico.id !== "4");

        const pacoteCompleto = document.querySelector('[data-id="4"]');

        if (pacoteCompleto) {
            pacoteCompleto.classList.remove("bg-black", "text-white");
            pacoteCompleto.classList.add("bg-white");

            const descricao = pacoteCompleto.querySelector("p");
            if (descricao) {
                descricao.classList.remove("text-white");
                descricao.classList.add("text-gray-500");
            }

            const icone = pacoteCompleto.querySelector("img, svg");
            if (icone) {
                icone.classList.remove("invert");
            }
        }
        servicosSelecionados.push({
          id,
          nome,
          preco
        });

        button.classList.remove("bg-white");
        button.classList.add("bg-black", "text-white");

        const descricao = button.querySelector("p");

        if (descricao) {
          descricao.classList.remove("text-gray-500");
          descricao.classList.add("text-white");
        }

        const icone = button.querySelector("img, svg");

        if (icone) {
          icone.classList.add("invert");
        }

      }

      atualizarResumo();

    });

  });

  botaoBarbeiro.forEach((button) => {
    button.addEventListener("click", () => {
      botaoBarbeiro.forEach((btn) => {
        btn.classList.remove("bg-black", "text-white");
        btn.classList.add("bg-white");
        const cargo = btn.querySelector("p");
        if (cargo) {
          cargo.classList.remove("text-white");
          cargo.classList.add("text-gray-500");
        }
      });
      button.classList.remove("bg-white");
      button.classList.add("bg-black", "text-white");
      const cargo = button.querySelector("p");
      if (cargo) {
        cargo.classList.remove("text-gray-500");
        cargo.classList.add("text-white");
      }

      atualizarHorariosDisponiveis();
    });
  });

  botaoHorario.forEach((button) => {
    button.addEventListener("click", () => {
      if (
        button.classList.contains("opacity-50") ||
        button.hasAttribute("disabled") ||
        button.classList.contains("bg-gray-200")
      ) {
        return;
      }

      botaoHorario.forEach((btn) => {
        btn.classList.remove("bg-black", "text-white");
        btn.classList.add("bg-white");
      });
      button.classList.remove("bg-white");
      button.classList.add("bg-black", "text-white");
    });
  });

  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", () => {
      const diaSelecionado = document
        .querySelector(".calendar-day.bg-black")
        ?.textContent.trim();
      const servicoSelecionado = document
        .querySelector(".botao-pacote.bg-black h4")
        ?.textContent.trim();
      const barbeiroSelecionado = document
        .querySelector(".botao-barbeiro.bg-black h4")
        ?.textContent.trim();
      const horarioSelecionado = document
        .querySelector(".botao-horario.bg-black")
        ?.textContent.trim();


      const nome = document.getElementById("nome-cliente").value.trim();
      const email = document.getElementById("email-cliente").value.trim();
      const telefone = document.getElementById("telefone-cliente").value.trim();
      const valorTotal = servicosSelecionados.reduce((total, servico) => total + servico.preco, 0);

      const servicos = servicosSelecionados
      .map(servico => servico.nome)
      .join(", ");


      if (
        !nome ||
        !email ||
        !telefone ||
        !diaSelecionado ||
        servicosSelecionados.length === 0 ||
        !barbeiroSelecionado ||
        !horarioSelecionado
      ) {
      
        alert("Preencha todos os campos.");
      
        return;
      }

      const dadosAgendamento = {

        nome: nome,

        email: email,

        telefone: telefone,

        barbeiro: barbeiroSelecionado,

        dataAgendamento: `2026-07-${diaSelecionado.padStart(2, "0")}`,

        horario: horarioSelecionado,

        servicos: servicos,

        valorTotal: valorTotal

      };
      
      console.log("Enviando agendamento:", dadosAgendamento);

      alert("Agendamento realizado com sucesso!");

      salvarAgendamento(dadosAgendamento)
      .then(() => {

        alert("Agendamento realizado com sucesso!");

      })
      .catch(() => {
        alert("Erro ao realizar o agendamento.");
      });

      salvarHorarioOcupado( barbeiroSelecionado, diaSelecionado, horarioSelecionado);

      if (modal) {
        modal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
        resetarModal();
      }
    });
  }


  function gerarChaveHorario(barbeiro, dia, horario) {
  return `${barbeiro}-${dia}-${horario}`;
}

function salvarHorarioOcupado(barbeiro, dia, horario) {
  const chave = gerarChaveHorario(barbeiro, dia, horario);
  localStorage.setItem(chave, "ocupado");
}

function atualizarHorariosDisponiveis() {

  const diaSelecionado = document
    .querySelector(".calendar-day.bg-black")
    ?.textContent.trim();

  const barbeiroSelecionado = document
    .querySelector(".botao-barbeiro.bg-black h4")
    ?.textContent.trim();

  if (!diaSelecionado || !barbeiroSelecionado) return;

  botaoHorario.forEach((botao) => {

    const horario = botao.textContent.trim();

    const chave = gerarChaveHorario(
      barbeiroSelecionado,
      diaSelecionado,
      horario
    );

    if (localStorage.getItem(chave)) {

      botao.disabled = true;

      botao.classList.remove(
        "bg-black",
        "text-white",
        "bg-white"
      );

      botao.classList.add(
        "bg-gray-200",
        "text-gray-400",
        "cursor-not-allowed",
        "opacity-50"
      );

    } else {

      botao.disabled = false;

      botao.classList.remove(
        "bg-gray-200",
        "text-gray-400",
        "cursor-not-allowed",
        "opacity-50"
      );

      botao.classList.add("bg-white");

    }

  });

}

}

function atualizarResumo() {

  const resumoServicos = document.getElementById("resumo-servicos");
  const totalServicos = document.getElementById("total-servicos");

  resumoServicos.innerHTML = "";

  let total = 0;

  servicosSelecionados.forEach(servico => {

    total += servico.preco;

    resumoServicos.innerHTML += `
      <div class="flex justify-between items-center">
          <span class="text-gray-700">Pacote: ${servico.nome}</span>
          <span class="font-bold">R$ ${servico.preco.toFixed(2).replace(".", ",")}</span>
      </div>
    `;

  });

  totalServicos.textContent =
    `R$ ${total.toFixed(2).replace(".", ",")}`;

}

