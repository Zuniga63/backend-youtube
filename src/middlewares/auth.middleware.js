const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    try {
      const { authorization } = req.headers;
  
      if (!authorization) {
        throw new Error("Si sesión expiró");
      }

      const [_, token] = authorization.split(" ");

      if (!token) {
        throw new Error("Si sesión expiró");
      }

      const { id } = jwt.verify(token, procces.env.JWT_SECRET_KEY);

      req.user = id;
  
      next();
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  };