const jwt = require('jsonwebtoken');
const key = require('./config/secret_key')
exports.auth = (req, res, next) => {
 
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.status(401).send({ message: "Unauthorized" });
  }

  jwt.verify(token, key.secret, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Your Token No Longer Valid" });
    }

    req.userId = user.id;
    next();
  });
};