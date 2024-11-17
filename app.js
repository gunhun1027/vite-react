const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('./'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// 数据库连接
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'nav_sites'
});

db.connect((err) => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    console.log('数据库连接成功');
});

// API路由
// 获取所有网站
app.get('/api/sites', (req, res) => {
    const sql = 'SELECT * FROM sites ORDER BY category, title';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// 添加新网站
app.post('/api/sites', (req, res) => {
    const { title, url, category, description } = req.body;
    const sql = 'INSERT INTO sites (title, url, category, description) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, url, category, description], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: result.insertId, message: '添加成功' });
    });
});

// 删除网站
app.delete('/api/sites/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM sites WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: '删除成功' });
    });
});

// 管理员登录
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        req.session.isAdmin = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: '用户名或密码错误' });
    }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
}); 