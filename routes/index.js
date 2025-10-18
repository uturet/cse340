const express = require("express")
const router = express.Router()
const indexController = require("../controllers/indexController")
const inventoryRoutes = require("./inventory")
const classificationRoutes = require("./classification")

router.get("/", indexController.buildHome)
router.use("/inventory-model", inventoryRoutes)
router.use("/classifications", classificationRoutes)

module.exports = router
