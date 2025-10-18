const express = require("express")
const router = express.Router()
const classificationController = require("../controllers/classificationController")

router.get("/:id", classificationController.buildclassification)

module.exports = router
