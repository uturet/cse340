const pool = require("../database")


async function getAll() {
  const result = await pool.query(`SELECT * FROM classification`)
  return result.rows
}

async function getByID(id) {
  const result = await pool.query(`SELECT * FROM classification WHERE classification_id = $1`, [id])
  return result.rows
}

module.exports = {
  getAll,
  getByID,
}
