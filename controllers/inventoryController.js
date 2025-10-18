const inventoryModel = require("../models/inventoryModel")
const classificationModel = require("../models/classificationModel")

const inventoryController = {}

inventoryController.buildInventory = async (req, res, next) => {
  
  try {
    const { id } = req.params
    const vehicle = await inventoryModel.getVehicleById(id)
    const classifications = await classificationModel.getAll()
    const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`

    return res.render("inventory", {
      title,
      vehicle,
      classifications,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = inventoryController
