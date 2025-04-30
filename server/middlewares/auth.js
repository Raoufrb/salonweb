import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Accès non autorisé' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'mySuperSecretKey123!@#'); // Replace with your JWT_SECRET
        req.user = decoded; // Attach user info (id and role) to the request
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token invalide' });
    }
}

