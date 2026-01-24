const logger = require('../utils/logger');

// In-memory data store (replace with database in production)
const dataStore = new Map();
let idCounter = 1;

/**
 * Get all data
 */
exports.getData = (req, res) => {
    try {
        const data = Array.from(dataStore.values());

        logger.info(`Retrieved ${data.length} items for user: ${req.user.username}`);

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        logger.error(`Get data error: ${error.message}`);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
};

/**
 * Get data by ID
 */
exports.getDataById = (req, res) => {
    try {
        const { id } = req.params;
        const item = dataStore.get(parseInt(id));

        if (!item) {
            return res.status(404).json({ error: 'Data not found' });
        }

        logger.info(`Retrieved item ${id} for user: ${req.user.username}`);

        res.status(200).json({
            success: true,
            data: item
        });
    } catch (error) {
        logger.error(`Get data by ID error: ${error.message}`);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
};

/**
 * Create new data
 */
exports.createData = (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const newItem = {
            id: idCounter++,
            title,
            description: description || '',
            createdBy: req.user.username,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        dataStore.set(newItem.id, newItem);

        logger.info(`Created item ${newItem.id} by user: ${req.user.username}`);

        res.status(201).json({
            success: true,
            message: 'Data created successfully',
            data: newItem
        });
    } catch (error) {
        logger.error(`Create data error: ${error.message}`);
        res.status(500).json({ error: 'Failed to create data' });
    }
};

/**
 * Update data
 */
exports.updateData = (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const item = dataStore.get(parseInt(id));

        if (!item) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const updatedItem = {
            ...item,
            title: title || item.title,
            description: description !== undefined ? description : item.description,
            updatedAt: new Date().toISOString()
        };

        dataStore.set(parseInt(id), updatedItem);

        logger.info(`Updated item ${id} by user: ${req.user.username}`);

        res.status(200).json({
            success: true,
            message: 'Data updated successfully',
            data: updatedItem
        });
    } catch (error) {
        logger.error(`Update data error: ${error.message}`);
        res.status(500).json({ error: 'Failed to update data' });
    }
};

/**
 * Delete data
 */
exports.deleteData = (req, res) => {
    try {
        const { id } = req.params;

        if (!dataStore.has(parseInt(id))) {
            return res.status(404).json({ error: 'Data not found' });
        }

        dataStore.delete(parseInt(id));

        logger.info(`Deleted item ${id} by user: ${req.user.username}`);

        res.status(200).json({
            success: true,
            message: 'Data deleted successfully'
        });
    } catch (error) {
        logger.error(`Delete data error: ${error.message}`);
        res.status(500).json({ error: 'Failed to delete data' });
    }
};
