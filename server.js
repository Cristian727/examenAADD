const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Usamos el puerto definido en el entorno o 3000 por defecto

// Middleware para manejar JSON en las peticiones
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.send('Aquí estamos de examen');
});

// Ruta para verificar el estado del servidor
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Servidor 2' });
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
