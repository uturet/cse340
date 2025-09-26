const indexController = {}

indexController.buildHome = (req, res) => {
  res.render("index", { title: "Home" })
}

module.exports = indexController
