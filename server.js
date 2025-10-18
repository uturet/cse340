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

/* ***********************
 * Routes
 *************************/
app.use(static)

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use("/", indexRoutes)
app.use("/inventory", inventoryRoutes)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
