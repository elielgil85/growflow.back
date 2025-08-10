const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Padroniza para 'authorization' minúsculo, que é o mais comum
  const authHeader = req.header('authorization');

  // Verifica se o cabeçalho de autorização existe
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token provided, authorization denied.' });
  }

  // Verifica se o cabeçalho está no formato 'Bearer <token>'
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ msg: 'Token format is "Bearer <token>". Authorization denied.' });
  }
  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    // Tratamento de erros mais específico
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired. Authorization denied.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token. Authorization denied.' });
    }
    // Para outros erros não esperados
    return res.status(500).json({ msg: 'Server error during token validation.' });
  }
};
