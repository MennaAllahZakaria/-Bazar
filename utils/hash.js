const bcrypt = require("bcryptjs");

exports.hash = (val) => bcrypt.hash(val, 12);
exports.compare = (val, hash) => bcrypt.compare(val, hash);
