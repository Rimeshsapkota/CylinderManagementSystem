const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ role: "owner" }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
};