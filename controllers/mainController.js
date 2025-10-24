const classificationModel = require("../models/classificationModel")

const mainController = {}

mainController.error = async (req, res, next) => {
    try {
      const classifications = await classificationModel.getAll()
      const title = `Error`
      return res.render("error", {
        classifications,
        title
      })
      
  
    } catch (error) {
      return next(error)
    }
}

module.exports = mainController
