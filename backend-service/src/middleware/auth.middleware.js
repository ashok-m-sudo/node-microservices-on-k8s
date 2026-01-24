const axios = require('axios');
const logger = require('../utils/logger');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

/**
 * Middleware to verify JWT token with auth service
 */
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'No authorization token provided' });
        }

        // Verify token with auth service
        const response = await axios.get(`${AUTH_SERVICE_URL}/auth/verify`, {
            headers: { Authorization: token }
        });

        if (response.data.valid) {
            req.user = response.data.user;
            next();
        } else {
            res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        logger.error(`Auth middleware error: ${error.message}`);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = authMiddleware;
