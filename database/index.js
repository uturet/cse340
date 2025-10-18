const { Pool } = require("pg")

// Build connection options from environment variables when provided.
const connectionOptions = {}

if (process.env.DATABASE_URL) {
  connectionOptions.connectionString = process.env.DATABASE_URL
}

if (process.env.DB_HOST) {
  connectionOptions.host = process.env.DB_HOST
}

if (process.env.DB_NAME) {
  connectionOptions.database = process.env.DB_NAME
}

if (process.env.DB_USER) {
  connectionOptions.user = process.env.DB_USER
}

if (process.env.DB_PASSWORD) {
  connectionOptions.password = process.env.DB_PASSWORD
}

if (process.env.DB_PORT) {
  connectionOptions.port = Number(process.env.DB_PORT)
}

const pool =
  Object.keys(connectionOptions).length > 0
    ? new Pool(connectionOptions)
    : new Pool()

module.exports = pool
