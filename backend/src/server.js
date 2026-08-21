const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const sequelize = require('./config/database');
const User = require('./models/User');
const Snippet = require('./models/Snippet');
const Comment = require('./models/Comment');

const authRoutes = require('./routes/authRoutes');
const snippetRoutes = require('./routes/snippetRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
    },
});

app.set('io', io);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'API CodeReview AI rodando 🚀' });
});

app.use('/api/auth', authRoutes);
app.use('/api/snippets', snippetRoutes);
app.use('/api/comments', commentRoutes);

io.on('connection', (socket) => {
    console.log('🔌 Cliente conectado:', socket.id);

    socket.on('disconnect', () => {
        console.log('🔌 Cliente desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;

sequelize.authenticate()
    .then(() => {
        console.log('✅ Conectado ao MySQL com sucesso!');
        return sequelize.sync();
    })
    .then(() => {
        console.log('📦 Tabelas sincronizadas!');
        server.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Erro ao conectar no banco:', err);
    });