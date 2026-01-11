const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');

const router = express.Router(); /*Express provides something called a Router.Think of it as a mini app inside your main app.
It helps organize routes cleanly — especially when you have many.
Example analogy:
Your main app = a shopping mall
Each router = a shop that handles only one category (like “users”, “products”, “orders”)
Here, your router will handle all routes related to users.*/

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router; //Export routes to use in main server
