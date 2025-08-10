// routes/tasks.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Middleware de autenticação
const {
  getTasks,
  getTaskById, // Importa o novo controlador
  createTask,
  updateTask,
  deleteTask,
  getUser,
} = require('../controllers/taskController');

// Rota para obter os dados do usuário autenticado
// Colocada aqui para reutilizar o `auth` middleware
router.get('/user', auth, getUser);


// Todas as rotas neste ficheiro são protegidas pelo middleware 'auth'.
// O middleware é executado antes da função do controlador correspondente.

// @route   GET api/tasks
// @desc    Obtém todas as tarefas do utilizador
// @access  Private
router.get('/', auth, getTasks);

// @route   GET api/tasks/:id
// @desc    Obtém uma tarefa específica pelo ID
// @access  Private
router.get('/:id', auth, getTaskById);

// @route   POST api/tasks
// @desc    Cria uma nova tarefa
// @access  Private
router.post('/', auth, createTask);

// @route   PUT api/tasks/:id
// @desc    Atualiza uma tarefa existente
// @access  Private
router.put('/:id', auth, updateTask);

// @route   DELETE api/tasks/:id
// @desc    Remove uma tarefa
// @access  Private
router.delete('/:id', auth, deleteTask);

module.exports = router;
