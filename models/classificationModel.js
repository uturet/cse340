const pool = require("../database")

async function getAll() {
  const result = await pool.query(`SELECT * FROM classification`)
  return result.rows
}

async function getByID(id) {
  const result = await pool.query(`SELECT * FROM classification WHERE classification_id = $1`, [id])
  return result.rows
}

async function createClassification(name) {
  const sql = `INSERT INTO classification (classification_name) VALUES ($1) RETURNING *`
  const result = await pool.query(sql, [name])
  return result.rows[0]
}

module.exports = {
  getAll,
  getByID,
  createClassification,
}
