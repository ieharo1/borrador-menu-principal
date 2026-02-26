const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

router.use(protect);

router.get('/', dashboardController.renderDashboard);
router.get('/dashboard', dashboardController.renderDashboard);
router.get('/generar', dashboardController.renderGenerate);
router.get('/verificar', dashboardController.renderVerify);
router.get('/historial', dashboardController.renderHistory);
router.get('/upload', dashboardController.renderUpload);
router.get('/carga-masiva', dashboardController.renderUpload);
router.get('/exportar', dashboardController.renderExport);
router.get('/export', dashboardController.renderExport);
router.get('/logs', dashboardController.renderLogs);

module.exports = router;
