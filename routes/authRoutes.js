const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Employee = require('../models/employee');
const router = express.Router();
require('dotenv').config();
const SECRET = process.env.JWT_SECRET || 'mySecretKey';

 // Move to .env in production
console.log('JWT_SECRET =', SECRET);

// LOGIN Route
router.post('/login', async (req, res) => {
  const { Username, Password } = req.body;

  if (!Username || !Password) {
    return res.status(400).json({ message: 'Username and Password are required' });
  }

  try {
    const employee = await Employee.findOne({ Username });

    if (!employee) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    const isMatch = await bcrypt.compare(Password, employee.Password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

  const token = jwt.sign({ id: employee._id }, SECRET, { expiresIn: '1h' });

 res.json({ token });


  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// REGISTER Route (only Username and Password)
router.post('/register', async (req, res) => {
  const { Username, Password } = req.body;

  if (!Username || !Password) {
    return res.status(400).json({ message: 'Username and Password are required' });
  }

  try {
    const existingUser = await Employee.findOne({ Username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newEmployee = new Employee({
      Username,
      Password: hashedPassword
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Employee registered successfully' });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

