// controllers/taskController.js

const Task = require('../models/Task'); // Importa o modelo de Tarefa.
const User = require('../models/User'); // Importa o modelo de User.


// Função para obter o utilizador autenticado
exports.getUser = async (req, res) => {
    try {
      // O ID do utilizador está em req.user.id (adicionado pelo middleware)
      // .select('-password') remove o campo da password da resposta
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
};

// Função para obter todas as tarefas de um utilizador.
exports.getTasks = async (req, res) => {
  try {
    // Procura todas as tarefas cujo 'userId' corresponde ao ID do utilizador autenticado.
    // O ID do utilizador foi adicionado ao 'req' pelo middleware de autenticação.
    const tasks = await Task.find({ userId: req.user.id }).sort({ date: -1 }); // Ordena pelas mais recentes.
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Função para obter uma única tarefa pelo ID.
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // Verifica se a tarefa pertence ao utilizador autenticado.
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(task);
    } catch (err) {
        console.error(err.message);
        // Se o ID não for um ObjectId válido, o Mongoose pode lançar um erro.
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(500).send('Server Error');
    }
};


// Função para criar uma nova tarefa.
exports.createTask = async (req, res) => {
  const { name, description, plantType } = req.body;

  try {
    // Cria uma nova instância do modelo Task com valores padrão.
    const newTask = new Task({
      name,
      description,
      plantType,
      completed: false, // Valor padrão
      growthStage: 0,   // Valor padrão
      userId: req.user.id, // Associa a tarefa ao utilizador autenticado.
    });

    // Guarda a nova tarefa na base de dados.
    const task = await newTask.save();
    res.status(201).json(task); // Retorna a tarefa criada.
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Função para atualizar uma tarefa existente.
exports.updateTask = async (req, res) => {
  const { name, description, completed } = req.body;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Verifica se a tarefa pertence ao utilizador autenticado.
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Constrói um objeto com os campos a serem atualizados.
    const taskFields = {};
    if (name) taskFields.name = name;
    if (description) taskFields.description = description;
    if (completed !== undefined) {
        taskFields.completed = completed;
        // Lógica de crescimento: só incrementa se a tarefa estiver sendo marcada como completa
        if (completed && !task.completed) {
            taskFields.growthStage = Math.min(task.growthStage + 1, 5);
        }
    }

    // Atualiza a tarefa na base de dados.
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true } // Retorna o documento atualizado
    );

    res.json(updatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// Função para remover uma tarefa.
exports.deleteTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Verifica se a tarefa pertence ao utilizador.
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Usa findByIdAndDelete que é a função mais moderna
    await Task.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
