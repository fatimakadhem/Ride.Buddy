const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Ingen token – åtkomst nekad" });
  }

  const token = authHeader.split(" ")[1]; // ✅ declare token first

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // ✅ now works
    console.log("Decoded JWT:", decoded); // ✅ for debug
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ message: "Ogiltig token" });
  }
};

module.exports = verifyToken;
