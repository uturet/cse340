const utilities = require("../utilities")
const classificationModel = require("../models/classificationModel")
const accountModel = require("../models/accountModel")
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { firstname, lastname, email, password } = req.body
  
    const regResult = await accountModel.registerAccount(
      firstname,
      lastname,
      email,
      password
    )    
    const classifications = await classificationModel.getAll()
    console.log(regResult)
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        classifications,
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        classifications,
        nav,
      })
    }
  }


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    const classifications = await classificationModel.getAll()
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      classifications,
      errors: null
    })
  }

async function buildLogin(req, res, next) {
    const classifications = await classificationModel.getAll()
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        classifications,
        errors: null
    })
}
  
module.exports = { buildLogin, buildRegister, registerAccount}