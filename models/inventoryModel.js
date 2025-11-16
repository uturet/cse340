const pool = require("../database")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  )
}

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

async function getAllWithClassification() {
  const sql = `
    SELECT i.*, c.classification_name
    FROM inventory i
    JOIN classification c ON c.classification_id = i.classification_id
    ORDER BY c.classification_name, i.inv_make, i.inv_model, i.inv_year
  `
  const result = await pool.query(sql)
  return result.rows
}

async function createInventory({
  classification_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
}) {
  const sql = `
    INSERT INTO inventory (
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10
    )
    RETURNING *
  `

  const values = [
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  ]

  const result = await pool.query(sql, values)
  return result.rows[0]
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

module.exports = {
  getVehicleById,
  getByCls,
  getClassifications,
  getAllWithClassification,
  createInventory,
  deleteInventoryItem
}
