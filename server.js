/**
 * FilmTV TikTok Clone - Servidor Local Ultraligero (Sin dependencias externas)
 * Permite reproducir los trailers de YouTube sin el bloqueo Error 153 de Google (Origin/Referer).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let safePath = decodeURI(req.url.split('?')[0]);
  if (safePath === '/' || safePath === '') safePath = '/index.html';

  const fullPath = path.join(PUBLIC_DIR, safePath);

  // Seguridad básica: evitar salir del directorio
  if (!fullPath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Acceso denegado');
  }

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });

    fs.createReadStream(fullPath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Archivo no encontrado: ' + safePath);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🎬 FilmTV TikTok Clone corriendo en: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});

// Mantener vivo y manejar errores
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`El puerto ${PORT} ya está en uso, reintentando en puerto 3001...`);
    server.listen(3001, '0.0.0.0');
  } else {
    console.error('Error en el servidor:', err);
  }
});
