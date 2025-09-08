const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.post('/api/checkout', async (req, res) => {
    try {
        const { items, sender } = req.body;

        const itensFormatados = items.map(item => ({
            reference_id: `prod-${item.item_description.replace(/\s/g, '-').toLowerCase()}`,
            name: item.item_description,
            quantity: item.item_quantity,
            unit_amount: Math.round(item.item_amount * 100)
        }));

        const body = {
            reference_id: 'carrinho-gesso-primus-001',
            customer: {
                name: sender.name,
                email: sender.email
            },
            items: itensFormatados
        };

        const response = await axios.post(
            'https://sandbox.api.pagbank.com/charges',
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.PAGBANK_TOKEN}`
                }
            }
        );

        res.json({ paymentUrl: response.data.links[1].href });

    } catch (error) {
        console.error('Erro na requisição para o PagBank:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Erro ao processar o pagamento.', details: error.response ? error.response.data : error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});