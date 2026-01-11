// Importing required modules
const User = require('../models/userModel'); // The MongoDB User model
const bcrypt = require('bcryptjs'); // For hashing and comparing passwords
const generateToken = require('../utils/generateToken'); // Custom JWT token generator

// ---------------------------
// REGISTER A NEW USER
// ---------------------------
const registerUser = async (req, res) => {
  try {
    // Extract data from request body
    const { name, email, password } = req.body;

    // 1️⃣ Check if a user already exists with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // 400 = Bad Request
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2️⃣ Hash the user's password before saving it
    // bcrypt.hash() encrypts the password using 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create a new user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4️⃣ Send back response with user details + token
    res.status(201).json({
      message: 'User registered successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id), // Generate and return JWT
    });

  } catch (error) {
    // 500 = Server error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------------------
// LOGIN USER
// ---------------------------
const loginUser = async (req, res) => {
  try {
    // Extract login credentials
    const { email, password } = req.body;

    // 1️⃣ Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      // 404 = Not Found
      return res.status(404).json({ message: 'User not found' });
    }

    // 2️⃣ Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // 400 = Bad Request (wrong credentials)
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3️⃣ Generate a JWT token for authenticated session
    const token = generateToken(user._id);

    // 4️⃣ Send success response with token and basic info
    res.status(200).json({
      message: 'Login successful',
      _id: user._id,
      name: user.name,
      email: user.email,
      token, // send the token so the frontend can store it
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export both functions to use in routes
module.exports = { registerUser, loginUser };



/*const User = require('../models/userModel');
const bcrypt = require('bcryptjs'); //Uses bcryptjs to hash and check passwords.
const jwt = require('jsonwebtoken'); //Uses jsonwebtoken (JWT) to generate secure login tokens.

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; //req.body is the data the frontend sends when someone registers (through a form or API).

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); //bcrypt.hash() encrypts the user’s password before storing it.The second argument 10 is the salt rounds — how strong the encryption is.
    // More rounds = more secure, but slower.
//Example:
//Plain: "secure123"
//Hashed: "$2a$10$6akjA.sL82jqKQb..."

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }  //This token is what the frontend stores (like in localStorage) and sends back in headers for protected routes (like /profile, /jobs, etc.).
};

module.exports = { registerUser, loginUser };*/
