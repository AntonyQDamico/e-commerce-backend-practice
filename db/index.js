const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "e-commerce-portfolio",
  password: "postgres",
  port: 5432,
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
  asyncQuery: (text, params) => pool.query(text, params),
};
