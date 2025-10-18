const pool = require("../database")


async function getVehicleById(invId) {
  const result = await pool.query(
    `SELECT * FROM inventory
      WHERE inv_id = $1`,
    [invId]
  )
  return result.rows[0] || null
}

async function getByCls(id) {
  const result = await pool.query(
    `SELECT * FROM inventory
      WHERE classification_id = $1`,
    [id]
  )
  return result.rows
}


module.exports = {
  getVehicleById,
  getByCls
}
