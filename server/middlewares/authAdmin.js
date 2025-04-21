import jwt from 'jsonwebtoken';

export function authAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant ❌' });
  }

  try {
    const decoded = jwt.verify(token, '123456'); // ← même clé que dans login
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide ou expiré ❌' });
  }
}
