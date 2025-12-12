const express = require("express")
const router = express.Router()
const reviewController = require("../controllers/reviewController")

router.post("/", reviewController.createReview)
router.post("/:id/edit", reviewController.updateReview)
router.post("/:id/delete", reviewController.deleteReview)

module.exports = router
