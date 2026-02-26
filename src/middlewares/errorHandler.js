const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('Error:', err);

  if (err.name === 'CastError') {
    const message = 'Recurso no encontrado';
    error = { success: false, message, statusCode: 404 };
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `El valor '${field}' ya existe`;
    error = { success: false, message, statusCode: 400 };
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { success: false, message, statusCode: 400 };
  }

  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: error.message || 'Error del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    return res.status(statusCode).json(response);
  }

  res.status(statusCode).render('error', { 
    title: 'Error',
    error: response 
  });
};

module.exports = errorHandler;
