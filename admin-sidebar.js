/**
 * Sidebar compartilhada do painel administrativo WeBarber.
 *
 * Uso em cada página admin:
 *   <body data-active-page="dashboard"> ... </body>
 *   <div id="sidebar-root"></div>  (como primeiro filho do container flex)
 *   <script src="../admin-sidebar.js"></script>
 *
 * Mantém a navegação, o item ativo, o logout e um guard de sessão simples.
 */

(function () {
  const CHAVE_SESSAO = "webarber_adm";

  // Guard de sessão: se não estiver logado, volta para o login.
  // (a própria página de login grava a flag ao autenticar)
  if (localStorage.getItem(CHAVE_SESSAO) !== "true") {
    window.location.href = "../login page/loginpage.html";
    return;
  }

  const itens = [
    { chave: "dashboard", icone: "fa-chart-line", titulo: "Dashboard", href: "../gerenciamento page/gerenciamento.html" },
    { chave: "agendamentos", icone: "fa-calendar-check", titulo: "Agendamentos", href: "../adm-gerenciar-horarios/adm-gerenciar-horarios.html" },
    { chave: "barbeiros", icone: "fa-users", titulo: "Barbeiros", href: "../adm-gerenciar-barbeiros/adm-gerenciar-barbeiros.html" },
    { chave: "servicos", icone: "fa-scissors", titulo: "Serviços", href: "../adm-gerenciar-servicos/adm-gerenciar-servicos.html" },
    { chave: "bloquear-dia", icone: "fa-calendar-times", titulo: "Bloquear dias", href: "../adm-bloquear-dia/adm-bloquear-dia.html" },
    { chave: "bloquear-horarios", icone: "fa-ban", titulo: "Bloquear horários", href: "../adm-bloquear-horarios/adm-bloquear-horarios.html" },
  ];

  const ativo = document.body.dataset.activePage || "";

  const linksHtml = itens
    .map((item) => {
      const classeAtivo =
        item.chave === ativo
          ? "text-white bg-gray-900"
          : "text-gray-400 hover:text-white";
      return `
        <a href="${item.href}"
           title="${item.titulo}"
           class="p-3 ${classeAtivo} rounded-xl transition">
          <i class="fas ${item.icone} text-lg"></i>
        </a>`;
    })
    .join("");

  const html = `
    <aside class="w-20 bg-black flex flex-col items-center py-6 justify-between shrink-0 h-screen">
      <div class="flex flex-col items-center space-y-8 w-full">
        <a href="../index.html"
           title="Início"
           class="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-black text-xl">
          B
        </a>
        <nav class="flex flex-col space-y-4 w-full items-center">
          ${linksHtml}
        </nav>
      </div>
      <button id="btn-logout-sidebar"
              title="Sair"
              class="p-3 text-gray-400 hover:text-red-500 transition">
        <i class="fas fa-sign-out-alt text-lg"></i>
      </button>
    </aside>
  `;

  const root = document.getElementById("sidebar-root");
  if (root) {
    root.outerHTML = html;
  }

  const btnLogout = document.getElementById("btn-logout-sidebar");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem(CHAVE_SESSAO);
      window.location.href = "../login page/loginpage.html";
    });
  }
})();
