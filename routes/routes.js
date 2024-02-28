import express from "express";
import bodyParser from "body-parser";
import { Client } from "pg";

const router = express.Router();
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// \dt para verificar as tabelas

client.connect();

router.use(bodyParser.json());

// Rota para adicionar um novo paciente
router.post("/pacientes", async (req, res) => {
  try {
    const { nome, telefone, data_nascimento, sexo, ala, quarto } = req.body;
    const result = await client.query(
      "INSERT INTO pacientes (nome, telefone, data_nascimento, sexo, ala, quarto) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [nome, telefone, data_nascimento, sexo, ala, quarto]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para listar todos os pacientes
router.get("/pacientes", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM pacientes");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para editar informações de um paciente
router.put("/pacientes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, telefone, data_nascimento, sexo, ala, quarto } = req.body;
    const result = await client.query(
      "UPDATE pacientes SET nome = $1, telefone = $2, data_nascimento = $3, sexo = $4, ala = $5, quarto = $6 WHERE id = $7 RETURNING *",
      [nome, telefone, data_nascimento, sexo, ala, quarto, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para remover o registro de um paciente
router.delete("/pacientes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await client.query("DELETE FROM pacientes WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
