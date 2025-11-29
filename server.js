/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const path = require("path")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const indexRoutes = require("./routes/index")
const inventoryRoutes = require("./routes/inventory")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const utilities = require("./utilities/")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))
app.use(cookieParser())
app.use(utilities.checkJWTToken)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * Routes
 *************************/
app.use(static)

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use("/", indexRoutes)
app.use("/inventory", inventoryRoutes)
// Account routes
app.use("/account", require("./routes/accountRoute"))
app.use((req, res, next) => {
  res.locals.messages = req.flash(); // all flash messages available in `messages`
  next();
});
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || "5050"
const host = process.env.HOST || "localhost"

console.log(host, port)

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
