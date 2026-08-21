const Snippet = require('../models/Snippet');
const User = require('../models/User');
const { analyzeCode } = require('../services/aiService');

// Criar snippet
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

        // Responde IMEDIATAMENTE pro usuário, sem esperar a IA
        res.status(201).json(snippet);

        // Dispara a análise em background (não bloqueia a resposta acima)
        processAIAnalysis(snippet.id, code, language);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar snippet.' });
    }
};

// Função separada que roda "por trás" da resposta HTTP
async function processAIAnalysis(snippetId, code, language) {
    try {
        await Snippet.update({ aiStatus: 'analisando' }, { where: { id: snippetId } });

        const resultado = await analyzeCode(code, language);

        await Snippet.update(
            {
                aiStatus: 'concluido',
                aiScore: resultado.score,
                aiFeedback: resultado,
            },
            { where: { id: snippetId } }
        );

        console.log(`✅ Análise concluída para snippet ${snippetId}`);
    } catch (err) {
        console.error(`❌ Erro na análise do snippet ${snippetId}:`, err.message);
        await Snippet.update({ aiStatus: 'erro' }, { where: { id: snippetId } });
    }
}

// Listar todos os snippets
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

// Buscar um snippet específico
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