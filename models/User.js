// models/User.js

// Importa o Mongoose, uma biblioteca que facilita a interação com o MongoDB.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define o "schema" ou a estrutura para o modelo de Utilizador (User).
// Um schema define os campos, os tipos de dados e as regras de validação para uma coleção no MongoDB.
const UserSchema = new Schema({
  // Campo para o nome de utilizador.
  username: {
    type: String, // O tipo de dado é uma string.
    required: true, // Este campo é obrigatório.
    unique: true, // Garante que cada nome de utilizador seja único na base de dados.
  },
  // Campo para o email do utilizador.
  email: {
    type: String,
    required: true,
    unique: true, // Garante que cada email seja único.
  },
  // Campo para a password do utilizador.
  password: {
    type: String,
    required: true, // A password será armazenada como um hash, não como texto simples.
  },
  // Campo para a data de registo, com um valor por defeito da data e hora atuais.
  date: {
    type: Date,
    default: Date.now,
  },
});

// Exporta o modelo 'User', tornando-o disponível para ser utilizado noutras partes da aplicação.
// O Mongoose irá criar uma coleção chamada 'users' (plural e em minúsculas) no MongoDB.
module.exports = mongoose.model('user', UserSchema);
