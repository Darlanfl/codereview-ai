const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const User = require('./models/User'); // 
const authRoutes = require('./routes/authRoutes');
const Snippet = require('./models/Snippet');
const snippetRoutes = require('./routes/snippetRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/snippets', snippetRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API CodeReview AI rodando 🚀' });
});

const PORT = process.env.PORT || 3001;

sequelize.authenticate()
    .then(() => {
        console.log('✅ Conectado ao MySQL com sucesso!');
        return sequelize.sync();
    })
    .then(() => {
        console.log('📦 Tabelas sincronizadas!');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Erro ao conectar no banco:', err);
    });