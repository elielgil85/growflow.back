// controllers/authController.js

// Importa os módulos necessários.
const User = require('../models/User'); // Modelo de utilizador.
const bcrypt = require('bcryptjs'); // Para encriptar passwords.
const jwt = require('jsonwebtoken'); // Para criar e verificar JSON Web Tokens.

// Função para registar um novo utilizador.
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verifica se já existe um utilizador com o mesmo email.
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Cria uma nova instância do modelo User.
    user = new User({
      username,
      email,
      password,
    });

    // Encripta a password antes de a guardar na base de dados.
    const salt = await bcrypt.genSalt(10); // Gera um "salt" para a encriptação.
    user.password = await bcrypt.hash(password, salt); // Aplica o hash à password.

    // Guarda o novo utilizador na base de dados.
    await user.save();

    // Cria o payload para o JWT, contendo o ID do utilizador.
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Assina o token JWT.
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Usa a chave secreta das variáveis de ambiente.
      { expiresIn: '5h' }, // Define um tempo de expiração para o token.
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token }); // Retorna o token ao cliente.
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Função para autenticar (login) um utilizador.
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Procura o utilizador pelo email.
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Compara a password fornecida com a password encriptada na base de dados.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Se as credenciais estiverem corretas, cria e envia um novo token JWT.
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
