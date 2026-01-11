const jwt = require('jsonwebtoken'); //Importing the jsonwebtoken library, which helps create (sign) and verify JWT tokens.

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { //The jwt.sign() function returns a string token that looks something like this
    expiresIn: '30d', // token valid for 30 days
  });
};

module.exports = generateToken;
