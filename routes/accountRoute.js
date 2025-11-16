const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", accountController.buildLogin)
// Route to build login view
router.post(
  "/login",
  // regValidate.loginRules(),
  // regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))
router.get('/register', accountController.buildRegister)
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )
// router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router

