const express = require("express")
const router = express.Router()
const inventoryController = require("../controllers/inventoryController")
const utilities = require("../utilities")

router.get("/", inventoryController.buildManagement)
router.get("/add-classification", utilities.ProtectedSection(inventoryController.buildAddClassification))
router.post("/add-classification", utilities.ProtectedSection(inventoryController.createClassification))
router.get("/add-inventory", utilities.ProtectedSection(inventoryController.buildAddInventory))
router.post("/add-inventory", utilities.ProtectedSection(inventoryController.createInventory))
router.get("/:id", inventoryController.buildInventory)
router.post("/:id", utilities.ProtectedSection(inventoryController.deleteInventory))

module.exports = router
