const express = require("express")
const router = express.Router()
const inventoryController = require("../controllers/inventoryController")

router.get("/:id", inventoryController.buildInventory)

module.exports = router
