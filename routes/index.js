const express = require("express")
const router = express.Router()
const indexController = require("../controllers/indexController")
const inventoryRoutes = require("./inventory")
const classificationRoutes = require("./classification")
const reviewRoutes = require("./review")
const mainController = require("../controllers/mainController")

router.get("/", indexController.buildHome)
router.get("/error", mainController.error)
router.use("/inventory-model", inventoryRoutes)
router.use("/classifications", classificationRoutes)
router.use("/review", reviewRoutes)

module.exports = router
