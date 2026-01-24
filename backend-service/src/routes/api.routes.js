const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data.controller');

router.get('/data', dataController.getData);
router.post('/data', dataController.createData);
router.get('/data/:id', dataController.getDataById);
router.put('/data/:id', dataController.updateData);
router.delete('/data/:id', dataController.deleteData);

module.exports = router;
