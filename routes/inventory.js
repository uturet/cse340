const express = require("express")
const router = express.Router()
const inventoryController = require("../controllers/inventoryController")

router.get("/", inventoryController.buildManagement)
router.get("/add-classification", inventoryController.buildAddClassification)
router.post("/add-classification", inventoryController.createClassification)
router.get("/add-inventory", inventoryController.buildAddInventory)
router.post("/add-inventory", inventoryController.createInventory)
router.get("/:id", inventoryController.buildInventory)

module.exports = router
