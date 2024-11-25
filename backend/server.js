const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

// Configuração do Express
const app = express();
const port = 3000;

app.use(cors()); // Habilitar CORS
app.use(bodyParser.json()); // Parse do corpo das requisições em JSON

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cadastro'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL!');
});

// Rota para buscar o endereço via API ViaCEP
app.get('/cep/:cep', async (req, res) => {
    try {
        const { cep } = req.params;
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Erro ao buscar CEP');
    }
});

// Rota para salvar um usuário no banco de dados
app.post('/users', (req, res) => {
    const { cpf, nome, idade,cep, endereco } = req.body;

    if (!cpf || !nome || !idade || !cep || !endereco) {
        return res.status(400).send('Dados incompletos');
    }

    const query = 'INSERT INTO usuarios (cpf, nome, idade,cep, endereco) VALUES (?, ?, ?, ?,?)';
    db.query(query, [cpf, nome, idade,cep, endereco], (err, result) => {
        if (err) {
            return res.status(500).send('Erro ao salvar usuário');
        }
        res.status(201).send({ id: result.insertId });
    });
});

app.get('/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).json({ error: 'Erro ao buscar usuários!' });
        }
        res.status(200).json(results);
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});