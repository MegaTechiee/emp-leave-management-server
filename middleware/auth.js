const jwt = require('jsonwebtoken');

function authMiddleware(requiredRole) {
    return (req, res, next) => {
        // const authHeader = req.headers['authorization'];
        // if (!authHeader) return res.status(401).json({ message: 'Token missing' });

        // const token = authHeader?.split(' ')[1] || req.cookies?.token;
        const token = req.headers['authorization']?.split(' ')[1] || req.cookies?.token;
        if (!token) return res.status(401).json({ message: 'Token missing' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (requiredRole && decoded.role !== requiredRole) {
                return res.status(403).json({ message: 'Forbidden: insufficient role' });
            }

            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
}

module.exports = authMiddleware;
