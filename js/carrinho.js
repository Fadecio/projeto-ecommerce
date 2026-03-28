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
    const produtoPreco = parseFloat(
      elementoProduto
        .querySelector(".preco")
        .textContent.replace("R$", "")
        .replace(".", "")
        .replace(",", "."),
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
    atualizarContadorCarrinho();
    renderizarTabelaDoCarrinho();
  });
});

function salvarProdutosNoCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
  const produtos = localStorage.getItem("carrinho");
  return produtos ? JSON.parse(produtos) : [];
}

//passo 4- atualizar o contador do carrinho de compras;

function atualizarContadorCarrinho() {
  const produtos = obterProdutosDoCarrinho();
  let total = 0;

  produtos.forEach((produto) => {
    total += produto.quantidade;
  });

  document.getElementById("contador-carrinho").textContent = total;
}

atualizarContadorCarrinho();

// passo 5- renderizar a tabela do carrinho de compras;

function renderizarTabelaDoCarrinho() {
  const produtos = obterProdutosDoCarrinho();
  const corpoTabela = document.querySelector("#modal-1-content table tbody");
  corpoTabela.innerHTML = ""; //limpar o conteúdo da tabela antes de renderizar os produtos

  produtos.forEach((produto) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="td-produto"><img src="${produto.imagem}" alt="${produto.nome}"></td>
                    <td>${produto.nome}</td>
                    <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
                    <td class="td-quantidade"><input type="number" value="${produto.quantidade}" min="1"></td>
                    <td class="td-preco-total">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
                    <td><button class="btn-remover" data-id="${produto.id}" id="deletar"></button></td>  
                   `;

    corpoTabela.appendChild(tr);
  });
}

renderizarTabelaDoCarrinho();

// Objetivo 2 - remover produtos do carrinho:
//  passo 1- pegar o botão de deletar do html;

const corpoTabela = document.querySelector("#modal-1-content table tbody");
corpoTabela.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("btn-remover")) {
    const id = evento.target.dataset.id;

    removerProdutosDoCarrinho(id);
  }
});

function removerProdutosDoCarrinho(id) {
  const produtos = obterProdutosDoCarrinho();
  const carrinhoAtualizado = produtos.filter((produto) => produto.id !== id);

  salvarProdutosNoCarrinho(carrinhoAtualizado);
  atualizarContadorCarrinho();
  renderizarTabelaDoCarrinho();
}
