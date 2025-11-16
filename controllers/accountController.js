const utilities = require("../utilities")
const classificationModel = require("../models/classificationModel")
const accountModel = require("../models/accountModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()
bcrypt = require('bcrypt')

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { firstname, lastname, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const regResult = await accountModel.registerAccount(
      firstname,
      lastname,
      email,
      hashedPassword
    )    
    const classifications = await classificationModel.getAll()
  
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
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { email, password } = req.body
  console.log(email, password)
  const accountData = await accountModel.getAccountByEmail(email)
  const classifications = await classificationModel.getAll()
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      email,
      classifications
    })
    return
  }
  try {
    console.log(accountData)
    if (await bcrypt.compare(password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        email,
        classifications
      })
    }
  } catch (error) {
    console.log(error.message)
    throw new Error('Access Forbidden')
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
  
module.exports = { buildLogin, buildRegister, registerAccount, accountLogin }