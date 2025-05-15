const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Hämta JWT_SECRET från .env
const JWT_SECRET = process.env.JWT_SECRET;

// Skapa token-funktion
function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

// Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kontrollera att användaren inte redan finns
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "E-post används redan." });
    }

    const newUser = await User.create({ name, email, password });
    const token = generateToken(newUser);
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ message: "Serverfel vid registrering." });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Fel e-post eller lösenord." });
    }

    const token = generateToken(user);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Serverfel vid inloggning." });
  }
};
