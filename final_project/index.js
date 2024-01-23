const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
  // Check for the presence of a token in the request headers or session
  const token = req.headers.authorization || req.session.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Missing token" });
  }

  try {
    // Verify the token using the secret key (you should use a more secure way to store the secret key)
    const decoded = jwt.verify(token, "yourSecretKey");

    // Attach the decoded user information to the request for further use in routes
    req.user = decoded;

    // Continue to the next middleware or route
    next();
  } catch (err) {
    // Token verification failed
    return res.status(403).json({ message: "Forbidden - Invalid token" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on port", PORT));