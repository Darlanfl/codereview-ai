const Comment = require('../models/Comment');
const User = require('../models/User');

// Criar comentário em um snippet
exports.create = async (req, res) => {
    try {
        const { content } = req.body;
        const { snippetId } = req.params;

        if (!content || content.trim() === '') {
            return res.status(400).json({ error: 'O comentário não pode estar vazio.' });
        }

        const comment = await Comment.create({
            content,
            userId: req.userId,
            snippetId,
        });

        // Busca o comentário completo, já com os dados do autor
        const commentCompleto = await Comment.findByPk(comment.id, {
            include: { model: User, attributes: ['id', 'name'] },
        });

        res.status(201).json(commentCompleto);

        // Notifica em tempo real quem estiver vendo o snippet
        const io = req.app.get('io');
        io.emit('comment:created', commentCompleto);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar comentário.' });
    }
};

// Listar comentários de um snippet
exports.listBySnippet = async (req, res) => {
    try {
        const { snippetId } = req.params;

        const comments = await Comment.findAll({
            where: { snippetId },
            include: { model: User, attributes: ['id', 'name'] },
            order: [['createdAt', 'ASC']],
        });

        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar comentários.' });
    }
};