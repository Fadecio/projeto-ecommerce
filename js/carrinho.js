// Refatoração: Adicionadas constantes para seletores de DOM para melhorar manutenção e evitar repetição.
// Melhoria: Centralizar seletores facilita mudanças futuras no HTML sem alterar múltiplos locais no código.
// Melhoria: Adicionada validação para garantir que elementos existem antes de manipular.

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
  BOTAO_REMOVER: ".btn-remover"
};

// Objetivo 1 - quando clicar no botão de adicionar ao carrinho temos que atualizar o contador,
// adicionar o produto no localStorage e atualizar o html do carrinho.

// PARTE 1 - vamos adicionar +1 no icone do carrinho

// Refatoração: Melhorada a obtenção dos botões com validação.
// Melhoria: Adicionada verificação se os botões existem para evitar erros.

const botaoAdicionarCarrinho = document.querySelectorAll(SELECTORES.BOTAO_ADICIONAR);
if (!botaoAdicionarCarrinho.length) {
  console.error("Botões de adicionar ao carrinho não encontrados.");
}

// passo 2 - adicionar um evento de escuta nesses botões para quando clicar disparar uma ação;

botaoAdicionarCarrinho.forEach((botao) => {
  botao.addEventListener("click", (evento) => {
    // passo 3- pega as informações do produto clicado e adiciona ao localStorage;
    const elementoProduto = evento.target.closest(SELECTORES.PRODUTO);
    if (!elementoProduto) return; // Refatoração: Adicionada validação para elemento produto.

    const produtoId = elementoProduto.dataset.id;
    const produtoNome = elementoProduto.querySelector(SELECTORES.NOME_PRODUTO)?.textContent;
    const produtoImagem = elementoProduto.querySelector(SELECTORES.IMAGEM_PRODUTO)?.getAttribute("src");
    const precoTexto = elementoProduto.querySelector(SELECTORES.PRECO_PRODUTO)?.textContent;

    if (!produtoId || !produtoNome || !produtoImagem || !precoTexto) {
      console.error("Informações do produto incompletas.");
      return;
    }

    // Refatoração: Melhorada a extração do preço com validação.
    // Melhoria: Usar replaceAll para simplificar e evitar erros.
    const produtoPreco = parseFloat(
      precoTexto.replace("R$", "").replaceAll(".", "").replace(",", ".")
    );

    if (isNaN(produtoPreco)) {
      console.error("Preço do produto inválido.");
      return;
    }

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
    atualizarCarrinhoETabela();
  });
});

// Refatoração: Funções de localStorage mantidas, mas adicionados comentários explicativos.
// Melhoria: Encapsulamento das operações de localStorage para facilitar testes e manutenção.

function salvarProdutosNoCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
  const produtos = localStorage.getItem("carrinho");
  return produtos ? JSON.parse(produtos) : [];
}

//passo 4- atualizar o contador do carrinho de compras;

// Refatoração: Usado reduce para calcular o total de forma mais concisa.
// Melhoria: Reduce é mais funcional e evita mutação de variável externa.
// Melhoria: Adicionada validação para o elemento contador.

function atualizarContadorCarrinho() {
  const produtos = obterProdutosDoCarrinho();
  const total = produtos.reduce((soma, produto) => soma + produto.quantidade, 0);

  const contadorElemento = document.getElementById(SELECTORES.CONTADOR_CARRINHO.slice(1)); // Remover # para getElementById
  if (contadorElemento) {
    contadorElemento.textContent = total;
  } else {
    console.error("Elemento contador do carrinho não encontrado.");
  }
}



// passo 5- renderizar a tabela do carrinho de compras;

// Refatoração: Melhorada a criação do HTML com template literals mais limpos.
// Melhoria: Adicionada validação para o corpo da tabela.
// Melhoria: Usado map para gerar as linhas de forma mais funcional.

function renderizarTabelaDoCarrinho() {
  const produtos = obterProdutosDoCarrinho();
  const corpoTabela = document.querySelector(SELECTORES.CORPO_TABELA);
  if (!corpoTabela) {
    console.error("Corpo da tabela do carrinho não encontrado.");
    return;
  }

  corpoTabela.innerHTML = ""; //limpar o conteúdo da tabela antes de renderizar os produtos

  const linhasHTML = produtos.map((produto) => {
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
  }).join("");

  corpoTabela.innerHTML = linhasHTML;
}



// Objetivo 2 - remover produtos do carrinho:
//  passo 1- pegar o botão de deletar do html;

// Refatoração: Usado a constante para o seletor.
// Melhoria: Adicionada validação para o corpo da tabela.

const corpoTabela = document.querySelector(SELECTORES.CORPO_TABELA);
if (!corpoTabela) {
  console.error("Corpo da tabela do carrinho não encontrado.");
}

//passo 2- adicionar evento de escuta no tbody;
corpoTabela.addEventListener("click", (evento) => {
  if (evento.target.classList.contains(SELECTORES.BOTAO_REMOVER.slice(1))) { // Remover . para class
    const id = evento.target.dataset.id;
    if (id) {
      //passo 3- remover o produto no localStorage;
      removerProdutosDoCarrinho(id);
    }
  }
});

// Objetivo 3 - atualizar os valores do carrinho:

//  passo 1- adicionar evento de escuta no input no tbody;
corpoTabela.addEventListener("input", (evento) => {
  //passo 2- atualizar o valor total do produto;
  if (evento.target.classList.contains(SELECTORES.INPUT_QUANTIDADE.slice(1))) { // Remover . para class
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

//passo 4- atualizar o html do carrinho retirando o produto;
// Refatoração: Função mantida, mas adicionado comentário explicativo.
// Melhoria: O uso de filter é eficiente para remoção imutável.

function removerProdutosDoCarrinho(id) {
  const produtos = obterProdutosDoCarrinho();
  const carrinhoAtualizado = produtos.filter((produto) => produto.id !== id);

  salvarProdutosNoCarrinho(carrinhoAtualizado);
  atualizarCarrinhoETabela();
}

//passo 3- atualizar o valor total do carrinho;
// Refatoração: Usado reduce para calcular o total de forma mais concisa.
// Melhoria: Reduce evita loop manual e mutação.
// Melhoria: Adicionada validação para o elemento total.

function atualizarValorTotalCarrinho() {
  const produtos = obterProdutosDoCarrinho();
  const valorTotal = produtos.reduce((soma, produto) => soma + (produto.preco * produto.quantidade), 0);

  const totalElemento = document.getElementById(SELECTORES.TOTAL_CARRINHO.slice(1));
  if (totalElemento) {
    totalElemento.textContent = `R$ ${valorTotal.toFixed(2).replace(".", ",")}`;
  } else {
    console.error("Elemento total do carrinho não encontrado.");
  }
}

// Refatoração: Função de atualização geral mantida.
// Melhoria: Centraliza as atualizações para evitar repetição de chamadas.

function atualizarCarrinhoETabela() {
  atualizarContadorCarrinho();
  renderizarTabelaDoCarrinho();
  atualizarValorTotalCarrinho();
}

atualizarCarrinhoETabela();