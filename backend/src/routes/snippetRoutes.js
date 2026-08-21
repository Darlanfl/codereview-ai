const express = require('express');
const router = express.Router();
const snippetController = require('../controllers/snippetController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, snippetController.create); // rota protegida
router.get('/', snippetController.list);                    // rota pública
router.get('/:id', snippetController.getById);               // rota pública

module.exports = router;