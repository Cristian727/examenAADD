const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');
const app = express();
const PORT = process.env.PORT || 3000;
const HTTPS_PORT = 443;

// Middleware para redirigir HTTP a HTTPS
app.use((req, res, next) => {
  if (req.protocol !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

// Configurar la respuesta de la API
app.get('/', (req, res) => {
  res.send('Servidor Express corriendo en HTTPS');
});

// Condicional para habilitar HTTP o HTTPS
if (process.env.NODE_ENV === 'production') {
  // Si estamos en producción, usamos HTTPS
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/tudominio.com/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/tudominio.com/fullchain.pem', 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  // Crear servidor HTTPS
  https.createServer(credentials, app).listen(HTTPS_PORT, () => {
    console.log(`Servidor HTTPS corriendo en https://localhost:${HTTPS_PORT}`);
  });

  // Crear servidor HTTP (opcional para redirigir todo a HTTPS)
  http.createServer(app).listen(PORT, () => {
    console.log(`Servidor HTTP corriendo en http://localhost:${PORT}`);
  });
} else {
  // Si no estamos en producción, solo HTTP (para desarrollo)
  http.createServer(app).listen(PORT, () => {
    console.log(`Servidor HTTP corriendo en http://localhost:${PORT}`);
  });
}
