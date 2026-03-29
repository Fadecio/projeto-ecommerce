const SELECTORES = {
  BOTAO_ADICIONAR: ".adicionar-carrinho",
  CONTADOR_CARRINHO: "#contador-carrinho",
  CORPO_TABELA: "#modal-1-content table tbody",
  TOTAL_CARRINHO: "#total-carrinho",
  PRODUTO: ".produto",
  NOME_PRODUTO: ".nome",
  IMAGEM_PRODUTO: "img",
  PRECO_PRODUTO: ".preco",
  INPUT_QUANTIDADE: ".input-quantidade",
  BOTAO_REMOVER: ".btn-remover",
};

const botaoAdicionarCarrinho = document.querySelectorAll(SELECTORES.BOTAO_ADICIONAR);
if (!botaoAdicionarCarrinho.length) {
  console.error("Botões de adicionar ao carrinho não encontrados.");
}

botaoAdicionarCarrinho.forEach(botao => {
  botao.addEventListener("click", evento => {
    const elementoProduto = evento.target.closest(SELECTORES.PRODUTO);
    if (!elementoProduto) return;

    const produtoId = elementoProduto.dataset.id;
    const produtoNome = elementoProduto.querySelector(SELECTORES.NOME_PRODUTO)?.textContent;
    const produtoImagem = elementoProduto.querySelector(SELECTORES.IMAGEM_PRODUTO)?.getAttribute("src");
    const precoTexto = elementoProduto.querySelector(SELECTORES.PRECO_PRODUTO)?.textContent;

    if (!produtoId || !produtoNome || !produtoImagem || !precoTexto) {
      console.error("Informações do produto incompletas.");
      return;
    }

    const produtoPreco = parseFloat(precoTexto.replace("R$", "").replaceAll(".", "").replace(",", "."));

    if (isNaN(produtoPreco)) {
      console.error("Preço do produto inválido.");
      return;
    }

    const carrinho = obterProdutosDoCarrinho();

    const produtoExistente = carrinho.find(produto => produto.id === produtoId);
    if (produtoExistente) {
      produtoExistente.quantidade += 1;
    } else {
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
    atualizarCarrinhoETabela();
  });
});

function salvarProdutosNoCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
  const produtos = localStorage.getItem("carrinho");
  return produtos ? JSON.parse(produtos) : [];
}

function atualizarContadorCarrinho() {
  const produtos = obterProdutosDoCarrinho();
  const total = produtos.reduce(
    (soma, produto) => soma + produto.quantidade,
    0,
  );

  const contadorElemento = document.getElementById(SELECTORES.CONTADOR_CARRINHO.slice(1));
  if (contadorElemento) {
    contadorElemento.textContent = total;
  } else {
    console.error("Elemento contador do carrinho não encontrado.");
  }
}

function renderizarTabelaDoCarrinho() {
  const produtos = obterProdutosDoCarrinho();
  const corpoTabela = document.querySelector(SELECTORES.CORPO_TABELA);
  if (!corpoTabela) {
    console.error("Corpo da tabela do carrinho não encontrado.");
    return;
  }

  corpoTabela.innerHTML = "";

  const linhasHTML = produtos.map(produto => {
      const precoUnitario = produto.preco.toFixed(2).replace(".", ",");
      const precoTotal = (produto.preco * produto.quantidade).toFixed(2).replace(".", ",");
      return `<tr>
              <td class="td-produto"><img src="${produto.imagem}" alt="${produto.nome}"></td>
              <td>${produto.nome}</td>
              <td class="td-preco-unitario">R$ ${precoUnitario}</td>
              <td class="td-quantidade"><input type="number" class="input-quantidade" data-id="${produto.id}" value="${produto.quantidade}" min="1"></td>
              <td class="td-preco-total">R$ ${precoTotal}</td>
              <td><button class="btn-remover" data-id="${produto.id}"></button></td>
            </tr>`;
    })
    .join("");

  corpoTabela.innerHTML = linhasHTML;
}

const corpoTabela = document.querySelector(SELECTORES.CORPO_TABELA);
if (!corpoTabela) {
  console.error("Corpo da tabela do carrinho não encontrado.");
}

corpoTabela.addEventListener("click", (evento) => {
  if (evento.target.classList.contains(SELECTORES.BOTAO_REMOVER.slice(1))) {
    const id = evento.target.dataset.id;
    if (id) {
      removerProdutosDoCarrinho(id);
    }
  }
});

corpoTabela.addEventListener("input", (evento) => {
  if (evento.target.classList.contains(SELECTORES.INPUT_QUANTIDADE.slice(1))) {
    const id = evento.target.dataset.id;
    const novaQuantidade = parseInt(evento.target.value);
    if (id && !isNaN(novaQuantidade) && novaQuantidade > 0) {
      const produtos = obterProdutosDoCarrinho();
      const produto = produtos.find((p) => p.id === id);
      if (produto) {
        produto.quantidade = novaQuantidade;
        salvarProdutosNoCarrinho(produtos);
        atualizarCarrinhoETabela();
      }
    }
  }
});

function removerProdutosDoCarrinho(id) {
  const produtos = obterProdutosDoCarrinho();
  const carrinhoAtualizado = produtos.filter((produto) => produto.id !== id);

  salvarProdutosNoCarrinho(carrinhoAtualizado);
  atualizarCarrinhoETabela();
}

function atualizarValorTotalCarrinho() {
  const produtos = obterProdutosDoCarrinho();
  const valorTotal = produtos.reduce(
    (soma, produto) => soma + produto.preco * produto.quantidade,
    0,
  );

  const totalElemento = document.getElementById(
    SELECTORES.TOTAL_CARRINHO.slice(1),
  );
  if (totalElemento) {
    totalElemento.textContent = `Total: R$ ${valorTotal.toFixed(2).replace(".", ",")}`;
  } else {
    console.error("Elemento total do carrinho não encontrado.");
  }
}

function atualizarCarrinhoETabela() {
  atualizarContadorCarrinho();
  renderizarTabelaDoCarrinho();
  atualizarValorTotalCarrinho();
}

atualizarCarrinhoETabela();
