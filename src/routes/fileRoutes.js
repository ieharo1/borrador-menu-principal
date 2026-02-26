const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const fileController = require('../controllers/fileController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /txt|csv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.includes('text');
  
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Solo se permiten archivos .txt o .csv'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter
});

router.use(protect);

router.post('/upload', 
  upload.single('file'),
  [
    body('algorithm')
      .isIn(['MD5', 'SHA1', 'SHA256', 'SHA512', 'bcrypt'])
      .withMessage('Algoritmo inválido')
  ],
  fileController.uploadFile
);

router.post('/export', [
  body('format')
    .isIn(['csv', 'txt'])
    .withMessage('Formato inválido')
], fileController.exportResults);

module.exports = router;
