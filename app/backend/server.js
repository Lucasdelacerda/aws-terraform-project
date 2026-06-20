
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/health", (req, res) => {
    res.json({ status: "healthy" });
});

async function initializeDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Tabela tasks pronta");
    } catch (error) {
        console.error("Erro ao criar tabela:", error);
    }
}

app.get("/tasks", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tasks ORDER BY id DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Erro ao buscar tarefas"
        });
    }
});

app.post("/tasks", async (req, res) => {

    const { title } = req.body;

    if (!title) {
        return res.status(400).json({
            error: "Título é obrigatório"
        });
    }

    try {

        const result = await pool.query(
            "INSERT INTO tasks(title) VALUES($1) RETURNING *",
            [title]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Erro ao criar tarefa"
        });
    }
});


app.delete("/tasks/:id", async (req, res) => {

    const { id } = req.params;

    try {

        await pool.query(
            "DELETE FROM tasks WHERE id = $1",
            [id]
        );

        res.json({
            message: "Tarefa removida"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Erro ao remover tarefa"
        });
    }
});

app.listen(PORT, async () => {

    console.log(`Servidor iniciado na porta ${PORT}`);

    await initializeDatabase();
});
