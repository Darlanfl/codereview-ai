const Snippet = require('../models/Snippet');
const User = require('../models/User');
const { analyzeCode } = require('../services/aiService');

exports.create = async (req, res) => {
    try {
        const { title, language, code, description } = req.body;

        if (!title || !language || !code) {
            return res.status(400).json({ error: 'Título, linguagem e código são obrigatórios.' });
        }

        const snippet = await Snippet.create({
            title,
            language,
            code,
            description,
            userId: req.userId,
            aiStatus: 'pendente',
        });

        res.status(201).json(snippet);

        const io = req.app.get('io'); // pega o socket.io guardado no server.js
        processAIAnalysis(snippet.id, code, language, io);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar snippet.' });
    }
};

async function processAIAnalysis(snippetId, code, language, io) {
    try {
        await Snippet.update({ aiStatus: 'analisando' }, { where: { id: snippetId } });
        io.emit('snippet:updated', { id: snippetId, aiStatus: 'analisando' });

        const resultado = await analyzeCode(code, language);

        await Snippet.update(
            {
                aiStatus: 'concluido',
                aiScore: resultado.score,
                aiFeedback: resultado,
            },
            { where: { id: snippetId } }
        );

        // Busca o snippet completo (com dados do usuário) pra mandar pro frontend
        const snippetAtualizado = await Snippet.findByPk(snippetId, {
            include: { model: User, attributes: ['id', 'name'] },
        });

        io.emit('snippet:updated', snippetAtualizado);

        console.log(`✅ Análise concluída para snippet ${snippetId}`);
    } catch (err) {
        console.error(`❌ Erro na análise do snippet ${snippetId}:`, err.message);
        await Snippet.update({ aiStatus: 'erro' }, { where: { id: snippetId } });
        io.emit('snippet:updated', { id: snippetId, aiStatus: 'erro' });
    }
}

exports.list = async (req, res) => {
    try {
        const snippets = await Snippet.findAll({
            include: { model: User, attributes: ['id', 'name'] },
            order: [['createdAt', 'DESC']],
        });
        res.json(snippets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar snippets.' });
    }
};

exports.getById = async (req, res) => {
    try {
        const snippet = await Snippet.findByPk(req.params.id, {
            include: { model: User, attributes: ['id', 'name'] },
        });
        if (!snippet) {
            return res.status(404).json({ error: 'Snippet não encontrado.' });
        }
        res.json(snippet);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar snippet.' });
    }
};