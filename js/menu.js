// Aguarda o DOM carregar completamente antes de executar o código
document.addEventListener("DOMContentLoaded", () => {
    // Seleciona o botão do menu hambúrguer no DOM
    const botãoMenu = document.querySelector(".menu-hamburguer");
    // Seleciona o elemento do cabeçalho no DOM
    const cabecalho = document.querySelector(".cabecalho");

    // Adiciona um event listener para o evento de clique no botão do menu
    botãoMenu.addEventListener("click", () => {
        // Alterna a classe 'menu-ativo' no cabeçalho para mostrar ou ocultar o menu
        cabecalho.classList.toggle("menu-ativo");
    });

});
