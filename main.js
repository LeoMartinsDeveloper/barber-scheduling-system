const container = document.getElementById("container-modal");

import { inicializarLogicaModal } from "./agendamento page/agendamento.js";

document
.getElementById("abrir-agendamento")
.addEventListener("click", () => {

    if(container.innerHTML.trim() !== ""){

        document
        .getElementById("modal-agendamento")

        return;
    }

    fetch("../agendamento page/agendamento.html")
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;

            inicializarLogicaModal();
        });

});

//=======================================================================================

