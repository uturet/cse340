const pool = require("../database")

async function getReviews() {
  const result = await pool.query(
    "SELECT * FROM public.review"
  )
  return result.rows
}



async function getReviewByInvId(invId) {
  const result = await pool.query(
    `SELECT * FROM review
      WHERE inv_id = $1`,
    [invId]
  )
  return result.rows
}

async function getReviewById(reviewId) {
  const result = await pool.query(
    `SELECT * FROM review
      WHERE review_id = $1`,
    [reviewId]
  )
  return result.rows[0] || null
}

async function createReview({
  review_text,
  inv_id,
  account_id
}) {
  const sql = `
    INSERT INTO review (
      review_text,
      inv_id,
      account_id
    )
    VALUES (
      $1, $2, $3
    )
    RETURNING *
  `

  const values = [
    review_text,
    inv_id,
    account_id
  ]

  const result = await pool.query(sql, values)
  return result.rows[0]
}

async function updateReview(review_id, review_text) {
  try {
    const sql = `
        UPDATE review 
        SET 
          review_text = $1
        WHERE review_id = $2
        RETURNING *
      `
    const result = await pool.query(sql, [
      review_text,
      review_id,
    ])

    return result.rows[0]   // return updated row (truthy on success)
  } catch (error) {
    return error.message
  }
}

async function deleteReview(review_id) {
  try {
    const sql = 'DELETE FROM review WHERE review_id = $1'
    const data = await pool.query(sql, [review_id])
    return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}


module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewByInvId,
}
