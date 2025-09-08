document.getElementById('checkoutBtn').addEventListener('click', async () => {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const produto = document.getElementById('produto').value;
    const valor = document.getElementById('valor').value;

    if (!nome || !email || !produto || !valor) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const response = await fetch('/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                email,
                produto,
                valor
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('✅ Pedido enviado com sucesso!');
            console.log(result.message);
        } else {
            alert('❌ Erro ao enviar pedido!');
            console.error(result.message);
        }
    } catch (error) {
        alert('⚠️ Erro de conexão com o servidor.');
        console.error(error);
    }
});
