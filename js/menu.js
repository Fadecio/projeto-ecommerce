document.addEventListener("DOMContentLoaded", () => {
  const botãoMenu = document.querySelector(".menu-hamburguer");

  const cabecalho = document.querySelector(".cabecalho");

  botãoMenu.addEventListener("click", () => {
    cabecalho.classList.toggle("menu-ativo");
  });
});
