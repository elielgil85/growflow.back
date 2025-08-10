process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

process.on('uncaughtException', (err, origin) => {
  console.error(`Caught exception: ${err.message}\n` + `Exception origin: ${origin}`);
  process.exit(1);
});

// server.js

// Importa os módulos necessários
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Carrega as variáveis de ambiente do ficheiro .env
dotenv.config();

// Cria a aplicação Express
const app = express();

// Configuração do CORS
const allowedOrigins = [
  'https://jovial-cobbler-718b50.netlify.app',
  // Adicione outras origens permitidas aqui, se houver
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origem (como de ferramentas como Postman ou curl)
    // ou de origens na lista de permitidos.
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permite o envio de cookies de credenciais
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
  allowedHeaders: 'Content-Type,Authorization,x-auth-token', // Cabeçalhos permitidos
}));

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send('Server Error');
});

// Define a porta em que o servidor irá escutar, com um fallback seguro
const PORT = process.env.PORT || 5000;

// Inicia o servidor
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

