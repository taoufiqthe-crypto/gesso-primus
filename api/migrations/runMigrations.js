const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

(async () => {
  try {
    console.log('🔄 Rodando migrações...');

    await sequelize.authenticate();
    console.log('✅ Conexão com o banco bem-sucedida.');

    // Exemplo: criar tabela de usuários
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Migrações concluídas.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao rodar migrações:', error);
    process.exit(1);
  }
})();
