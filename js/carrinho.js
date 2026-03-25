// Objetivo 1 - quando clicar no botão de adicionar ao carrinho temos qye atualizar o contador,
// adicionar o produto no localStorage e atualizar o html do carrinho:

// PARTE 1 - vamos adicionar +1 no icone do carrinho

//  passo 1- pegar os botões de adicionar ao carrinho do html;

const botaoAdicionarCarrinho = document.querySelectorAll(".adicionar-carrinho");

// passo 2 - adicionar um evento de escuta nesse botões para quando clicar disparar uma ação;

botaoAdicionarCarrinho.forEach((botao) => {
  botao.addEventListener("click", (evento) => {
    // passo 3- pega a as informaçoes do produto clicado e adiciona ao localStorage;
    const elementoProduto = evento.target.closest(".produto");
    const produtoId = elementoProduto.dataset.id;
    const produtoNome = elementoProduto.querySelector(".nome").textContent;
    const produtoImagem = elementoProduto
      .querySelector("img")
      .getAttribute("src");
    const produtoPreco = parseFloat(elementoProduto.querySelector(".preco").textContent.replace("R$", "").replace(".", "").replace(",", "."),
    );

    //buscar lista de produtos no localStorage

    const carrinho = obterProdutosDoCarrinho();

    //verificar se o produto já existe no carrinho
    const produtoExistente = carrinho.find(
      (produto) => produto.id === produtoId,
    );
    if (produtoExistente) {
      //se existir, incrementar a quantidade
      produtoExistente.quantidade += 1;
    } else {
      //se não existir, adicionar o produto ao carrinho
      const produto = {
        id: produtoId,
        nome: produtoNome,
        imagem: produtoImagem,
        preco: produtoPreco,
        quantidade: 1,
      };
      carrinho.push(produto);
    }

    salvarProdutosNoCarrinho(carrinho);
  });
});

function salvarProdutosNoCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
  const produtos = localStorage.getItem("carrinho");
  return produtos ? JSON.parse(produtos) : [];
}
