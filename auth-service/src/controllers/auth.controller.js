const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// In-memory user store (replace with database in production)
const users = new Map();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

/**
 * Register a new user
 */
exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Validation
        if (!username || !password || !email) {
            return res.status(400).json({ error: 'Username, password, and email are required' });
        }

        // Check if user exists
        if (users.has(username)) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user
        users.set(username, {
            username,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        });

        logger.info(`User registered: ${username}`);

        res.status(201).json({
            message: 'User registered successfully',
            username,
            email
        });
    } catch (error) {
        logger.error(`Registration error: ${error.message}`);
        res.status(500).json({ error: 'Registration failed' });
    }
};

/**
 * Login user and return JWT token
 */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Get user
        const user = users.get(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        logger.info(`User logged in: ${username}`);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(500).json({ error: 'Login failed' });
    }
};

/**
 * Verify JWT token
 */
exports.verify = (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        res.status(200).json({
            valid: true,
            user: decoded
        });
    } catch (error) {
        logger.error(`Token verification error: ${error.message}`);
        res.status(401).json({
            valid: false,
            error: 'Invalid or expired token'
        });
    }
};
