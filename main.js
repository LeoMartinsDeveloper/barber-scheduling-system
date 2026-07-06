const container = document.getElementById("container-modal");

import { inicializarLogicaModal } from "./agendamento page/agendamento.js";

function abrirModal() {

    const modal = document.getElementById("modal-agendamento");

    if (modal) {
        modal.classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
        return;
    }

    fetch("../agendamento page/agendamento.html")
        .then(response => response.text())
        .then(html => {

            container.innerHTML = html;

            inicializarLogicaModal();

        })
        .catch(error => console.error(error));
}

document
    .querySelectorAll(".abrir-agendamento")
    .forEach(botao => {
        botao.addEventListener("click", abrirModal);
    });