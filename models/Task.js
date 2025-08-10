// models/Task.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define o schema para o modelo de Tarefa (Task).
const TaskSchema = new Schema({
  // Cria uma referência ao modelo 'User'.
  // Isto estabelece uma relação entre a tarefa e o utilizador que a criou.
  userId: {
    type: Schema.Types.ObjectId, // O tipo de dado é um ObjectId, o identificador único do MongoDB.
    ref: 'user', // A referência é para a coleção 'user'.
    required: true,
  },
  // Nome/Título da tarefa.
  name: {
    type: String,
    required: true,
  },
  // Descrição detalhada da tarefa.
  description: {
    type: String,
    default: '',
  },
  // Estado de conclusão da tarefa.
  completed: {
    type: Boolean,
    default: false, // Por defeito, uma nova tarefa não está completa.
  },
  // Estágio de crescimento da planta associada.
  growthStage: {
    type: Number,
    default: 0, // Começa no estágio 0.
  },
  // Tipo da planta.
  plantType: {
    type: String,
    required: true,
  },
  // Data de criação da tarefa.
  date: {
    type: Date,
    default: Date.now,
  },
});

// Exporta o modelo 'Task'. O Mongoose criará uma coleção chamada 'tasks'.
module.exports = mongoose.model('task', TaskSchema);