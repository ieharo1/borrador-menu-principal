# 🔐 Hash Generator - Sistema de Generación y Verificación de Hashes

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)

Sistema profesional para generar y verificar hashes de manera masiva, con autenticación JWT, historial guardado en MongoDB y exportación de resultados.

## 📋 Descripción

Hash Generator es una aplicación web completa que permite:

- ✅ Generar hashes con múltiples algoritmos (MD5, SHA1, SHA256, SHA512, bcrypt)
- ✅ Verificar la integridad de datos comparando hashes
- ✅ Carga masiva de archivos .txt o .csv
- ✅ Exportar resultados en CSV o TXT
- ✅ Historial completo de operaciones
- ✅ Sistema de autenticación con roles (admin/user)
- ✅ Dashboard moderno con Bootstrap 5

## 🛠 Stack Tecnológico

- **Backend**: Node.js + Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Frontend**: Bootstrap 5 + EJS
- **Autenticación**: JWT + bcrypt
- **Seguridad**: Helmet, CORS, Rate Limiting, express-validator

## 📦 Requisitos

- Node.js 18.x o superior
- MongoDB 6.x o superior
- npm o yarn

## 🚀 Cómo Instalar

```bash
# Clonar el repositorio
git clone https://github.com/ieharo1/borrador-menu-principal.git

# Entrar al directorio
cd borrador-menu-principal

# Instalar dependencias
npm install

# Configurar variables de entorno
# Edita el archivo .env con tus configuraciones
```

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hashgenerator
JWT_SECRET=tu_jwt_secret_key_aqui
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## ▶️ Cómo Ejecutar

```bash
# Iniciar el servidor
npm start

# O en modo desarrollo
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── config/
│   └── database.js         # Configuración de MongoDB
├── controllers/
│   ├── authController.js  # Controlador de autenticación
│   ├── dashboardController.js
│   ├── hashController.js  # Controlador de hashes
│   └── fileController.js  # Controlador de archivos
├── models/
│   ├── User.js            # Modelo de usuario
│   ├── HashHistory.js     # Modelo de historial
│   └── ActivityLog.js     # Modelo de logs
├── routes/
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── hashRoutes.js
│   └── fileRoutes.js
├── middlewares/
│   ├── authMiddleware.js  # Protección JWT
│   └── errorHandler.js    # Manejo de errores
├── services/
│   ├── hashService.js     # Lógica de hashes
│   └── fileService.js     # Lógica de archivos
├── views/
│   ├── index.ejs
│   ├── template.ejs
│   ├── error.ejs
│   └── dashboard/        # Vistas del dashboard
├── public/               # Archivos estáticos
│   ├── css/
│   ├── js/
│   └── uploads/
└── app.js               # Archivo principal
```

## 🔐 Seguridad Implementada

- ✅ Autenticación JWT
- ✅ Hash de contraseñas con bcrypt
- ✅ Validaciones backend con express-validator
- ✅ Rate limiting para prevenir abuso
- ✅ Helmet para headers seguros
- ✅ CORS configurado
- ✅ Control de roles (admin/user)

## 📝 Características

### Generación de Hashes
- MD5, SHA1, SHA256, SHA512, bcrypt
- Interfaz limpia e intuitiva
- Copiar al portapapeles

### Verificación
- Compara texto original con hash
- Soporte para todos los algoritmos
- Resultado visual claro

### Carga Masiva
- Archivos .txt y .csv
- Procesamiento por líneas
- Hasta 10MB por archivo

### Exportación
- Formato CSV y TXT
- Filtros por algoritmo
- Rango de fechas

## 👨‍💻 Desarrollado por Isaac Esteban Haro Torres

**Ingeniero en Sistemas · Full Stack · Automatización · Data**

- 📧 Email: zackharo1@gmail.com
- 📱 WhatsApp: 098805517
- 💻 GitHub: https://github.com/ieharo1
- 🌐 Portafolio: https://ieharo1.github.io/portafolio-isaac.haro/

---

⭐️ Si te gusta este proyecto, ¡no olvides darle una estrella en GitHub!
