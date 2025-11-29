const classificationModel = require("../models/classificationModel")
const indexController = {}

indexController.buildHome = async (req, res) => {
  const classifications = await classificationModel.getAll()

  res.render("index", { title: "Home", classifications, isAuth: res.locals.loggedin, })
}

module.exports = indexController
