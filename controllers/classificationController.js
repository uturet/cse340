const classificationModel = require("../models/classificationModel")
const inventoryModel = require("../models/inventoryModel")

const classificationController = {}

classificationController.buildclassification = async (req, res, next) => {
  
  try {
    const { id } = req.params
    const cls = (await classificationModel.getByID(id))[0]
    const vehicles = await inventoryModel.getByCls(id)
    const classifications = await classificationModel.getAll()
    const title = `${cls.classification_name} Vehicles`

    return res.render("classification", {
      accountData: res.locals.accountData,
      isAuth: res.locals.loggedin,
      title,
      classifications,
      cls,
      vehicles
    })

  } catch (error) {
    return next(error)
  }
}

module.exports = classificationController
