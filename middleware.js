const jwt = require('jsonwebtoken');
const key = require('./config/secret_key')
exports.auth = (req, res, next) => {
 
  const authHeader = req.headers["authorization"];
  let result = []

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    result.push({ message: "Unauthorized" })
    res.status(401).send(result);
  }

  jwt.verify(token, key.secret, (err, user) => {
    if (err) {
      result.push({ message: "Your Token No Longer Valid" })
      return res.status(403).send({ message: "Your Token No Longer Valid" });
    }

    req.userId = user.id;
    next();
  });
};