// server.js

// Importa os módulos necessários
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Carrega as variáveis de ambiente do ficheiro .env na raiz do backend
dotenv.config();

// Cria a aplicação Express
const app = express();

// --- Configuração do CORS ---
// Define as origens permitidas. É uma boa prática de segurança especificar
// de onde as requisições podem vir, em vez de deixar aberto para todos (*).
const allowedOrigins = [
    'http://localhost:9002', // A porta padrão do seu frontend Next.js
    'https://growflow-back.onrender.com' // A URL do seu ambiente de desenvolvimento na nuvem
];

const corsOptions = {
    origin: function (origin, callback) {
        // Permite requisições sem 'origin' (ex: Postman, apps mobile) ou se a origem estiver na lista.
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

// Middleware para permitir Cross-Origin Resource Sharing (CORS) com as opções definidas
app.use(cors(corsOptions));

// Middleware para fazer o "parsing" do corpo dos pedidos em formato JSON
app.use(express.json());

// Obtém a URI de conexão do MongoDB a partir das variáveis de ambiente
const db = process.env.MONGODB_URI;

// Função para conectar à base de dados
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Termina o processo com falha se a conexão falhar
    process.exit(1);
  }
};

// Executa a conexão com a base de dados
connectDB();

// Define as rotas da API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Define a porta em que o servidor irá escutar
const PORT = process.env.PORT 

// Inicia o servidor
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
