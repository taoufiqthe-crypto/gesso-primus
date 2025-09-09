// O array que vai guardar os itens do carrinho
let carrinho = [];

// Seleciona os elementos da página que usaremos
const botoesAdicionar = document.querySelectorAll('.add-to-cart-btn');
const listaCarrinho = document.getElementById('carrinho-itens');
const totalCarrinho = document.getElementById('carrinho-total');
const botaoCheckout = document.getElementById('checkoutBtn');

// Adiciona um "ouvinte de evento" para cada botão "Adicionar ao Carrinho"
botoesAdicionar.forEach(botao => {
    botao.addEventListener('click', (evento) => {
        const card = evento.target.closest('.card');
        const id = card.dataset.id;
        const nome = card.dataset.nome;
        const valor = parseFloat(card.dataset.valor);

        // Verifica se o item já está no carrinho
        const itemExistente = carrinho.find(item => item.id === id);

        if (itemExistente) {
            itemExistente.quantidade += 1;
        } else {
            carrinho.push({ id, nome, valor, quantidade: 1 });
        }
        
        // Atualiza a visualização do carrinho na página
        atualizarCarrinhoHTML();
    });
});

// Função para atualizar a lista e o total no HTML
function atualizarCarrinhoHTML() {
    listaCarrinho.innerHTML = '';
    let total = 0;

    carrinho.forEach(item => {
        const itemHTML = document.createElement('div');
        itemHTML.classList.add('carrinho-item');
        itemHTML.innerHTML = `
            <p>${item.nome} x${item.quantidade}</p>
            <p>R$ ${(item.valor * item.quantidade).toFixed(2).replace('.', ',')}</p>
        `;
        listaCarrinho.appendChild(itemHTML);
        total += item.valor * item.quantidade;
    });

    totalCarrinho.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

    if (carrinho.length > 0) {
        botaoCheckout.style.display = 'block';
        listaCarrinho.innerHTML += '<p>Agora você pode ir para o checkout.</p>';
    } else {
        botaoCheckout.style.display = 'none';
        listaCarrinho.innerHTML = '<p>Seu carrinho está vazio.</p>';
    }
}

// Lógica de checkout quando o botão é clicado
botaoCheckout.addEventListener('click', async () => {
    // Aqui você pediria os dados do cliente (nome, email)
    // Usaremos dados de teste por enquanto
    const nome = 'João da Silva';
    const email = 'cliente@email.com';

    // Formata os itens do carrinho para o backend
    const itensParaBackend = carrinho.map(item => ({
        item_description: item.nome,
        item_amount: item.valor,
        item_quantity: item.quantidade
    }));

    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sender: { name: nome, email: email },
                items: itensParaBackend // Envia a lista de itens
            })
        });

        const data = await response.json();

        if (data.paymentUrl) {
            window.location.href = data.paymentUrl;
        } else {
            alert('❌ Erro ao iniciar o pagamento!');
            console.error('Dados do erro:', data);
        }
    } catch (error) {
        alert('⚠️ Erro de conexão com o servidor.');
        console.error('Erro de rede:', error);
    }
});