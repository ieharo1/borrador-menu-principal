const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const hashController = require('../controllers/hashController');

router.use(protect);

router.post('/generate', [
  body('input')
    .trim()
    .notEmpty()
    .withMessage('El input es requerido'),
  body('algorithm')
    .isIn(['MD5', 'SHA1', 'SHA256', 'SHA512', 'bcrypt'])
    .withMessage('Algoritmo inválido')
], hashController.generateHash);

router.post('/verify', [
  body('input')
    .trim()
    .notEmpty()
    .withMessage('El input es requerido'),
  body('hash')
    .trim()
    .notEmpty()
    .withMessage('El hash es requerido'),
  body('algorithm')
    .isIn(['MD5', 'SHA1', 'SHA256', 'SHA512', 'bcrypt'])
    .withMessage('Algoritmo inválido')
], hashController.verifyHash);

router.get('/history', hashController.getHistory);
router.get('/stats', hashController.getStats);
router.delete('/history', hashController.deleteHistory);

module.exports = router;
