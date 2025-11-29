const invModel = require("../models/inventoryModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) => {
  if (typeof fn !== "function") {
    throw new TypeError("Expected a function");
  }
  Promise.resolve(fn(req, res, next)).catch(next);
};


Util.ProtectedSection = (fn) => (req, res, next) => {
  const accountData = res.locals.accountData;
  if (accountData && (accountData.account_type === 'Employee' || accountData.account_type === 'Admin')) {
    return fn(req, res, next);
  } else {
    req.flash("notice", "Please check your credentials and try again.")
    return res.redirect("/account/login");
  }
};

/* ************************
 * Constructs the nav HTML list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
      list += "<li>"
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
      list += "</li>"
    })
    list += "</ul>"
    return list
  }

module.exports = Util