const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

(async () => {
  try {
    console.log('🌱 Inserindo dados iniciais...');

    await sequelize.authenticate();

    // Inserir usuário padrão
    await sequelize.query(`
      INSERT INTO usuarios (nome, email, senha)
      VALUES ('Admin', 'admin@gessoprimus.com', '123456')
      ON CONFLICT (email) DO NOTHING
    `);

    console.log('✅ Seeds concluídas.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao rodar seeds:', error);
    process.exit(1);
  }
})();
