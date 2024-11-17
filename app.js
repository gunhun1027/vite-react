const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// 中间件配置
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // 开发环境下使用 false
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

// 验证管理员身份的中间件
const checkAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        res.status(401).json({ error: '未授权访问' });
    }
};

// API路由
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

app.post('/api/sites', checkAdmin, (req, res) => {
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

app.delete('/api/sites/:id', checkAdmin, (req, res) => {
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

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        req.session.isAdmin = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: '用户名或密码错误' });
    }
});

// 错误处理中间件
app.use((req, res, next) => {
    res.status(404).send('页面未找到');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('服务器错误');
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
}); 