// repositories/auditContextRepository.js
"use strict";
const pool = require("../config/db");

async function setCurrentUser(userId) {
  await pool.query(`SET LOCAL app.current_user_id = ${userId}`);
}

module.exports = { setCurrentUser };
