const HashHistory = require('../models/HashHistory');
const ActivityLog = require('../models/ActivityLog');
const hashService = require('../services/hashService');
const { validationResult } = require('express-validator');

const sanitizeInput = (input) => {
  return input ? input.trim() : '';
};

exports.generateHash = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { input, algorithm } = req.body;
    const sanitizedInput = sanitizeInput(input);

    if (!sanitizedInput) {
      return res.status(400).json({ 
        success: false, 
        message: 'El input no puede estar vacío' 
      });
    }

    const hash = await hashService.generateHash(sanitizedInput, algorithm);

    await HashHistory.create({
      user: req.user.id,
      type: 'generate',
      algorithm,
      input: sanitizedInput.substring(0, 100) + (sanitizedInput.length > 100 ? '...' : ''),
      result: hash,
      ipAddress: req.ip
    });

    await ActivityLog.create({
      user: req.user.id,
      action: 'generate_hash',
      description: `Generó hash ${algorithm} para: ${sanitizedInput.substring(0, 30)}...`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { algorithm, inputLength: sanitizedInput.length }
    });

    res.json({
      success: true,
      data: {
        input: sanitizedInput,
        hash,
        algorithm
      }
    });
  } catch (error) {
    console.error('Error en generateHash:', error);
    res.status(500).json({ success: false, message: 'Error al generar hash' });
  }
};

exports.verifyHash = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { input, hash, algorithm } = req.body;
    const sanitizedInput = sanitizeInput(input);

    const isValid = await hashService.verifyHash(sanitizedInput, hash, algorithm);

    await HashHistory.create({
      user: req.user.id,
      type: 'verify',
      algorithm,
      input: sanitizedInput.substring(0, 100) + (sanitizedInput.length > 100 ? '...' : ''),
      result: hash,
      verified: isValid,
      ipAddress: req.ip
    });

    await ActivityLog.create({
      user: req.user.id,
      action: 'verify_hash',
      description: `Verificó hash ${algorithm}: ${isValid ? 'Válido' : 'Inválido'}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: { algorithm, result: isValid }
    });

    res.json({
           data: {
 success: true,
        input: sanitizedInput,
        hash,
        algorithm,
        verified: isValid,
        message: isValid ? 'El hash ES válido' : 'El hash NO es válido'
      }
    });
  } catch (error) {
    console.error('Error en verifyHash:', error);
    res.status(500).json({ success: false, message: 'Error al verificar hash' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { user: req.user.id };
    
    if (req.query.type) query.type = req.query.type;
    if (req.query.algorithm) query.algorithm = req.query.algorithm;

    const history = await HashHistory.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await HashHistory.countDocuments(query);

    res.json({
      success: true,
      data: history,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error en getHistory:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

exports.deleteHistory = async (req, res) => {
  try {
    const result = await HashHistory.deleteMany({ user: req.user.id });

    await ActivityLog.create({
      user: req.user.id,
      action: 'delete_history',
      description: `Eliminó ${result.deletedCount} registros del historial`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({
      success: true,
      message: `Se eliminaron ${result.deletedCount} registros`
    });
  } catch (error) {
    console.error('Error en deleteHistory:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalHashes = await HashHistory.countDocuments({ user: req.user.id });
    const generated = await HashHistory.countDocuments({ user: req.user.id, type: 'generate' });
    const verified = await HashHistory.countDocuments({ user: req.user.id, type: 'verify' });

    const algorithmStats = await HashHistory.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$algorithm', count: { $sum: 1 } } }
    ]);

    const recentActivity = await HashHistory.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        totalHashes,
        generated,
        verified,
        algorithmStats,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Error en getStats:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};
