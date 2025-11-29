const utilities = require("../utilities")
const classificationModel = require("../models/classificationModel")
const accountModel = require("../models/accountModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()
bcrypt = require('bcrypt')


/* ****************************************
*  Process logout request
* *************************************** */
async function accountLogout(req, res) {
  // Clear the JWT cookie
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // match cookie options
  });

  // Optionally redirect to login page with a flash message
  req.flash("notice", "You have successfully logged out.");
  res.redirect("/account/login");
}


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
        accountData: res.locals.accountData,
        isAuth: res.locals.loggedin,
        title: "Login",
        classifications,
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        accountData: res.locals.accountData,
        isAuth: res.locals.loggedin,
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
      accountData: res.locals.accountData,
      isAuth: res.locals.loggedin,
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
        accountData: res.locals.accountData,
        isAuth: res.locals.loggedin,
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

async function buildManagement(req, res, next) {
  try {
    const [classifications] = await Promise.all([
      classificationModel.getAll(),
    ])

    console.log(res.locals.accountData)
    return res.render("account-management", {
      isAuth: res.locals.loggedin,
      accountData: res.locals.accountData,
      title: "account Management",
      classifications,
    })
  } catch (error) {
    return next(error)
  }
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    const classifications = await classificationModel.getAll()
    let nav = await utilities.getNav()
    res.render("account/register", {
      accountData: res.locals.accountData,
      isAuth: res.locals.loggedin,
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
      accountData: res.locals.accountData,
      isAuth: res.locals.loggedin,
        title: "Login",
        nav,
        classifications,
        errors: null
    })
}


/* ****************************************
 *  Deliver edit view
 * ************************************ */
async function buildEdit(req, res, next) {
  try {
    if (!res.locals.loggedin || !res.locals.accountData) {
      req.flash("notice", "You must be logged in to edit your account.");
      return res.redirect("/account/login");
    }

    const classifications = await classificationModel.getAll();
    const nav = await utilities.getNav();

    return res.render("account/edit", {
      accountData: res.locals.accountData,
      isAuth: res.locals.loggedin,
      title: "Edit Account",
      nav,
      classifications,
      errors: null,
      firstname: res.locals.accountData.account_firstname || "",
      lastname: res.locals.accountData.account_lastname || "",
      email: res.locals.accountData.account_email || "",
    });
  } catch (error) {
    return next(error);
  }
}

/* ****************************************
 *  Process update of user details (name/email)
 * ************************************ */
async function editUser(req, res, next) {
  try {
    if (!res.locals.loggedin || !res.locals.accountData) {
      req.flash("notice", "You must be logged in to perform that action.");
      return res.redirect("/account/login");
    }

    const { account_firstname, account_lastname, account_email } = req.body;
    const accountId = res.locals.accountData.account_id;

    const errors = [];
    if (!account_firstname || account_firstname.trim().length === 0) errors.push("First name is required.");
    if (!account_lastname || account_lastname.trim().length === 0) errors.push("Last name is required.");
    if (!account_email || account_email.trim().length === 0) errors.push("Email is required.");

    if (errors.length) {

      const classifications = await classificationModel.getAll();
      const nav = await utilities.getNav();
      return res.status(400).render("account/edit", {
        accountData: res.locals.accountData,
        isAuth: res.locals.loggedin,
        title: "Edit Account",
        nav,
        classifications,
        errors,
        firstname,
        lastname,
        email,
      });
    }

    const updateResult = await accountModel.updateAccount(
      accountId, account_firstname.trim(), account_lastname.trim(), account_email.trim());

    if (updateResult) {

      const accountData = await accountModel.getAccountByEmail(account_email)
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }

      req.flash("notice", "Account information updated successfully.");
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Unable to update account information. Please try again.");
      const classifications = await classificationModel.getAll();
      const nav = await utilities.getNav();
      return res.status(500).render("account/edit", {
        accountData: res.locals.accountData,
        isAuth: res.locals.loggedin,
        title: "Edit Account",
        nav,
        classifications,
        errors: ["Update failed."],
        firstname,
        lastname,
        email,
      });
    }
  } catch (error) {
    return next(error);
  }
}

/* ****************************************
 *  Process password change
 * ************************************ */
async function editPassword(req, res, next) {
  try {
    if (!res.locals.loggedin || !res.locals.accountData) {
      req.flash("notice", "You must be logged in to perform that action.");
      return res.redirect("/account/login");
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;
    const accountId = res.locals.accountData.account_id;

    const errors = [];
    if (!currentPassword) errors.push("Current password is required.");
    if (!newPassword || newPassword.length < 8) errors.push("New password must be at least 8 characters.");
    if (newPassword !== confirmPassword) errors.push("New password and confirmation do not match.");

    if (errors.length) {
      const classifications = await classificationModel.getAll();
      const nav = await utilities.getNav();
      return res.status(400).render("account/edit", {
        accountData: res.locals.accountData,
        isAuth: res.locals.loggedin,
        title: "Edit Account",
        nav,
        classifications,
        errors,
      });
    }

    const dbAccount = await accountModel.getAccountById(accountId);
    if (!dbAccount || !dbAccount.account_password) {
      req.flash("notice", "Unable to verify current password. Please contact support.");
      return res.redirect("/account/edit");
    }

    const passwordMatches = await bcrypt.compare(currentPassword, dbAccount.account_password);
    if (!passwordMatches) {
      const classifications = await classificationModel.getAll();
      const nav = await utilities.getNav();
      return res.status(400).render("account/edit", {
        accountData: res.locals.accountData,
        isAuth: res.locals.loggedin,
        title: "Edit Account",
        nav,
        classifications,
        errors: ["Current password is incorrect."],
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    const pwUpdateResult = await accountModel.updatePassword(accountId, hashed);

    if (pwUpdateResult) {
      req.flash("notice", "Password updated successfully.");
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Failed to update password. Please try again later.");
      const classifications = await classificationModel.getAll();
      const nav = await utilities.getNav();
      return res.status(500).render("account/edit", {
        accountData: res.locals.accountData,
        isAuth: res.locals.loggedin,
        title: "Edit Account",
        nav,
        classifications,
        errors: ["Failed to update password."],
      });
    }
  } catch (error) {
    return next(error);
  }
}


module.exports = { 
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  accountLogout,
  buildManagement,
  buildEdit,
  editUser,
  editPassword,
}