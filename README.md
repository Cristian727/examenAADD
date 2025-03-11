# Proyecto de Despliegue en VPS con Express

Este proyecto implementa un servidor Express en un VPS, con soporte para HTTP y HTTPS, gestionado con `pm2` para mantenerlo en ejecución.

## 1. Requisitos

- VPS con la IP `172.233.124.55`
- Node.js y npm instalados en el VPS
- Configuración de HTTPS mediante certificados SSL
- Despliegue y gestión del servidor con `pm2`
- Repositorio en GitHub con documentación clara

## 2. Instalación en el VPS

### 2.1 Conexión al VPS

Nos conectamos al VPS mediante SSH:

```bash
ssh root@172.233.124.55
```

### 2.2 Instalación de Node.js y npm

Ejecutamos los siguientes comandos:

```bash
sudo apt update
sudo apt install -y nodejs npm
```

### 2.3 Instalación de `pm2`

Para gestionar el proceso del servidor de forma eficiente:

```bash
sudo npm install pm2 -g
```

## 3. Configuración del Servidor Express

### 3.1 Creación del Servidor

El código de `server.js` permite ejecutar el servidor en HTTP o HTTPS según una variable de entorno:

```javascript
const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');
const app = express();
const PORT = process.env.PORT || 3000;
const USE_HTTPS = process.env.USE_HTTPS === 'true';

app.use(express.json());

app.get('/', (req, res) => {
  res.send('aqui estamos de chill');
});

if (USE_HTTPS) {
  const options = {
    key: fs.readFileSync('/etc/ssl/private/server.key'),
    cert: fs.readFileSync('/etc/ssl/private/server.crt')
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server running on https://localhost:${PORT}`);
  });
} else {
  http.createServer(app).listen(PORT, () => {
    console.log(`HTTP Server running on http://localhost:${PORT}`);
  });
}
```

### 3.2 Generación de Certificados SSL

Si se desea usar HTTPS, generamos certificados auto-firmados:

```bash
sudo mkdir /etc/ssl/private
sudo openssl genpkey -algorithm RSA -out /etc/ssl/private/server.key
sudo openssl req -new -key /etc/ssl/private/server.key -out /etc/ssl/private/server.csr
sudo openssl x509 -req -in /etc/ssl/private/server.csr -signkey /etc/ssl/private/server.key -out /etc/ssl/private/server.crt
```

## 4. Despliegue y Gestión del Servidor

### 4.1 Configuración de Variables de Entorno

Definimos las variables en el VPS:

```bash
export USE_HTTPS=true  # o false si se quiere solo HTTP
export PORT=3000
```

### 4.2 Ejecución con `pm2`

Para ejecutar y mantener el servidor en segundo plano:

```bash
pm2 start server.js --name "basic-action-server"
pm2 save
```

### 4.3 Configuración del Firewall

Permitimos tráfico en los puertos HTTP y HTTPS:

```bash
sudo ufw allow 80,443/tcp
```

## 5. Pruebas Realizadas

Comprobamos el funcionamiento accediendo a:

- HTTP: `http://172.233.124.55:3000`
- HTTPS: `https://172.233.124.55:3000`

Si el servidor responde con `"aqui estamos de chill"`, el despliegue ha sido exitoso.

## 6. Repositorio y Documentación

Este repositorio contiene:

- Código fuente en `server.js`
- Archivo de configuración `.github/workflows/deploy.yml`
- `.gitignore` para excluir `node_modules`
- `package.json` con las dependencias necesarias
- Este archivo `README.md` con la documentación detallada

## 7. Conclusión

Hemos desplegado un servidor Express en un VPS, asegurando soporte para HTTP y HTTPS, con gestión eficiente mediante `pm2`. La aplicación responde correctamente a las solicitudes y se mantiene en ejecución en el servidor.

![Captura desde 2025-03-10 11-32-19](https://github.com/user-attachments/assets/db763172-4fbc-4e27-adc3-47622abb5ef7)
![Captura desde 2025-03-10 11-57-57](https://github.com/user-attachments/assets/0bae95cd-45cc-418a-be10-908a91909842)
