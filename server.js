const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');       // User routes
const jobRoutes = require('./routes/jobRoutes');         // Jobs routes
const { protect } = require('./middleware/authMiddleware'); // Protect middleware
const applicationRoutes = require('./routes/applicationRoutes');
const jobMatchRoutes = require('./routes/jobMatchRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware - allows app to read JSON data
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);         // Public routes (register/login)
app.use('/api/jobs', protect, jobRoutes);  // Protected jobs routes
app.use('/api/linkedin', require('./routes/linkedinRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/applications', applicationRoutes);
app.use('/api/job', jobMatchRoutes);

// Sample public route
app.get('/', (req, res) => {
  res.send('Welcome to CareerCraft API 🚀');
});

// Example protected route
app.get('/api/protected', protect, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, you are authorized!` });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});



/*const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes'); // ✅ Import user routes

dotenv.config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 3000;

// ✅ Middleware - allows app to read JSON data
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Use routes
app.use('/api/users', userRoutes);

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to CareerCraft API 🚀');
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});*


/*career-craft-backend/
│
├── server.js              ← main backend file
├── .env                   ← environment variables
├── package.json           ← dependencies & project info
├── node_modules/          ← installed packages
│
├── config/                ← configuration files (like DB)
│   └── db.js
│
├── models/                ← database models (like User)
│
├── routes/                ← route files (like user routes)
│
└── controllers/           ← logic for routes (like user controller)
*/
