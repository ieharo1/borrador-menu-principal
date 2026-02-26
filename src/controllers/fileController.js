const path = require('path');
const fs = require('fs');
const HashHistory = require('../models/HashHistory');
const ActivityLog = require('../models/ActivityLog');
const hashService = require('../services/hashService');
const fileService = require('../services/fileService');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No se ha seleccionado ningún archivo' 
      });
    }

    if (!fileService.validateFileExtension(req.file.originalname)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false, 
        message: 'Solo se permiten archivos .txt o .csv' 
      });
    }

    const { algorithm } = req.body;
    const inputs = await fileService.processFile(req.file.path);

    if (inputs.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false, 
        message: 'El archivo está vacío' 
      });
    }

    const results = await hashService.processMultipleHashes(inputs, algorithm);

    for (const result of results) {
      await HashHistory.create({
        user: req.user.id,
        type: 'generate',
        algorithm,
        input: result.input,
        result: result.hash,
        fileName: req.file.originalname,
        ipAddress: req.ip
      });
    }

    await ActivityLog.create({
      user: req.user.id,
      action: 'upload_file',
      description: `Procesó archivo ${req.file.originalname} (${inputs.length} líneas) con ${algorithm}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { fileName: req.file.originalname, lineCount: inputs.length, algorithm }
    });

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      data: {
        fileName: req.file.originalname,
        lineCount: inputs.length,
        algorithm,
        results: results.slice(0, 100)
      },
      message: results.length > 100 ? 
        `Se procesaron ${results.length} líneas. Mostrando las primeras 100.` : 
        `Se procesaron ${results.length} líneas exitosamente`
    });
  } catch (error) {
    console.error('Error en uploadFile:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: 'Error al procesar archivo' });
  }
};

exports.exportResults = async (req, res) => {
  try {
    const { format, algorithm, startDate, endDate } = req.body;

    const query = { user: req.user.id, type: 'generate' };
    
    if (algorithm) query.algorithm = algorithm;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const hashes = await HashHistory.find(query).sort({ createdAt: -1 });

    if (hashes.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No hay datos para exportar' 
      });
    }

    const results = hashes.map(h => ({
      input: h.input,
      hash: h.result,
      algorithm: h.algorithm,
      timestamp: h.createdAt
    }));

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputPath = path.join(__dirname, `../../public/uploads/export_${timestamp}.${format}`);

    if (format === 'csv') {
      fileService.exportToCSV(results, outputPath);
    } else {
      fileService.exportToTXT(results, outputPath);
    }

    await ActivityLog.create({
      user: req.user.id,
      action: 'export_results',
      description: `Exportó ${hashes.length} registros en formato ${format}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { format, count: hashes.length }
    });

    res.json({
      success: true,
      data: {
        downloadUrl: `/uploads/export_${timestamp}.${format}`,
        count: hashes.length
      }
    });
  } catch (error) {
    console.error('Error en exportResults:', error);
    res.status(500).json({ success: false, message: 'Error al exportar resultados' });
  }
};
