const { Pool } = require("pg");

const pool = new Pool({
    user: "tierlist",
    host: "localhost",
    database: "tierlist",
    password: "T1&rL1st",
    port: 5432
});

module.exports = pool;