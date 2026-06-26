export function inicializarLogicaModal() {

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
    });
  });

  botaoServicos.forEach((button) => {
    button.addEventListener("click", () => {
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

      if (
        !diaSelecionado ||
        !servicoSelecionado ||
        !barbeiroSelecionado ||
        !horarioSelecionado
      ) {
        alert(
          "Por favor, selecione o dia, o serviço, o barbeiro e o horário antes de confirmar!",
        );
        return;
      }

      const dadosAgendamento = {
        dia: diaSelecionado,
        servico: servicoSelecionado,
        barbeiro: barbeiroSelecionado,
        horario: horarioSelecionado,
      };

      console.log("Enviando agendamento:", dadosAgendamento);

      alert("Agendamento realizado com sucesso!");

      if (modal) {
        modal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
        resetarModal();
      }
    });
  }
}

inicializarLogicaModal();