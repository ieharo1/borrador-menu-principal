const User = require('../models/User');
const HashHistory = require('../models/HashHistory');
const ActivityLog = require('../models/ActivityLog');

exports.renderDashboard = async (req, res) => {
  try {
    const totalHashes = await HashHistory.countDocuments({ user: req.user.id });
    const generated = await HashHistory.countDocuments({ user: req.user.id, type: 'generate' });
    const verified = await HashHistory.countDocuments({ user: req.user.id, type: 'verify' });

    const recentHistory = await HashHistory.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    const algorithmStats = await HashHistory.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$algorithm', count: { $sum: 1 } } }
    ]);

    res.render('dashboard/index', {
      title: 'Dashboard - Hash Generator',
      user: req.user,
      stats: { totalHashes, generated, verified, algorithmStats },
      recentHistory
    });
  } catch (error) {
    console.error('Error en renderDashboard:', error);
    res.status(500).render('error', { 
      title: 'Error',
      error: { message: 'Error al cargar el dashboard' } 
    });
  }
};

exports.renderGenerate = async (req, res) => {
  try {
    res.render('dashboard/generate', {
      title: 'Generar Hash - Hash Generator',
      user: req.user
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Error',
      error: { message: 'Error al cargar la página' } 
    });
  }
};

exports.renderVerify = async (req, res) => {
  try {
    res.render('dashboard/verify', {
      title: 'Verificar Hash - Hash Generator',
      user: req.user
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Error',
      error: { message: 'Error al cargar la página' } 
    });
  }
};

exports.renderHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const history = await HashHistory.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await HashHistory.countDocuments({ user: req.user.id });

    res.render('dashboard/history', {
      title: 'Historial - Hash Generator',
      user: req.user,
      history,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Error',
      error: { message: 'Error al cargar el historial' } 
    });
  }
};

exports.renderUpload = async (req, res) => {
  try {
    res.render('dashboard/upload', {
      title: 'Carga Masiva - Hash Generator',
      user: req.user
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Error',
      error: { message: 'Error al cargar la página' } 
    });
  }
};

exports.renderExport = async (req, res) => {
  try {
    res.render('dashboard/export', {
      title: 'Exportar Resultados - Hash Generator',
      user: req.user
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Error',
      error: { message: 'Error al cargar la página' } 
    });
  }
};

exports.renderLogs = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).render('error', { 
        title: 'Acceso Denegado',
        error: { message: 'No tienes acceso a esta sección' } 
      });
    }

    const logs = await ActivityLog.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.render('dashboard/logs', {
      title: 'Logs de Actividad - Hash Generator',
      user: req.user,
      logs
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Error',
      error: { message: 'Error al cargar los logs' } 
    });
  }
};
