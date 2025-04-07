const express = require('express');
const mysql = require('mysql2'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000; 

app.use(cors());
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo_app'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});


app.post('/tasks', (req, res) => {
    const task = req.body.task;
    db.query('INSERT INTO tasks (task) VALUES (?)', [task], (err, result) => {
        if (err) throw err;
        res.send({ id: result.insertId, task });
    });
});


app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});


app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { task, status } = req.body;
    db.query('UPDATE tasks SET task = ?, status = ? WHERE id = ?', [task, status, id], (err) => {
        if (err) throw err;
        res.send({ id, task, status });
    });
});


app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.send({ id });
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});