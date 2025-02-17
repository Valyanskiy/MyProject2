const path = require('path');
const http = require('http');
const fs = require('fs');

const PORT = 3000;
const HOST = 'localhost';

const server = http.createServer((req, res) => {
    // Формируем путь к файлу
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    // Определяем MIME-тип файла
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    // Читаем файл
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Файл не найден
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err, data) => {
                    if (err) {
                        // Если файл 404.html отсутствует, отправляем простой текст
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('404 Not Found');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(data);
                    }
                });
            } else {
                // Другая ошибка сервера
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
        } else {
            // Успешный ответ
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}/`);
});