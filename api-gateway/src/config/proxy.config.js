const { createProxyMiddleware } = require('http-proxy-middleware');
const logger = require('../utils/logger');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const BACKEND_SERVICE_URL = process.env.BACKEND_SERVICE_URL || 'http://localhost:3002';

/**
 * Setup proxy routes for microservices
 */
exports.setupProxies = (app) => {
    // Auth service proxy
    app.use('/api/auth', createProxyMiddleware({
        target: AUTH_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/api/auth': '/auth'
        },
        onProxyReq: (proxyReq, req, res) => {
            const targetPath = req.path.replace('/api/auth', '/auth');
            logger.info(`[PROXY] ${req.method} ${req.path} -> ${AUTH_SERVICE_URL}${targetPath}`);
        },
        onProxyRes: (proxyRes, req, res) => {
            logger.info(`[PROXY] Response from auth-service: ${proxyRes.statusCode} for ${req.method} ${req.path}`);
        },
        onError: (err, req, res) => {
            logger.error(`[PROXY ERROR] Auth-service: ${err.message}`);
            res.status(503).json({
                error: 'Auth service unavailable',
                message: err.message
            });
        }
    }));

    // Backend service proxy
    app.use('/api/backend', createProxyMiddleware({
        target: BACKEND_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/api/backend': '/api'
        },
        onProxyReq: (proxyReq, req, res) => {
            logger.info(`Proxying to backend-service: ${req.method} ${req.path}`);

            // Forward authorization header
            if (req.headers.authorization) {
                proxyReq.setHeader('Authorization', req.headers.authorization);
            }
        },
        onError: (err, req, res) => {
            logger.error(`Proxy error (backend-service): ${err.message}`);
            res.status(503).json({
                error: 'Backend service unavailable',
                message: err.message
            });
        }
    }));

    logger.info('Proxy routes configured');
};
