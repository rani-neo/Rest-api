const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const authRoutes = require('./routes/authRoutes'); 
const swaggerDocs = require('./swagger');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error(" MongoDB connection error:", err));

// Middleware
app.use(express.json());


const corsOptions = {
  origin: (origin, callback) => {
    console.log('Origin:', origin);
    if (
      !origin || // allow requests like Postman or same-origin
      origin === 'http://localhost:5000' || // Swagger UI
      origin === 'http://127.0.0.1:5500' || // Browser client
      origin === 'http://localhost' ||
      origin === 'https://google.com' ||
      origin === 'https://google.com.au'
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,PUT,POST,OPTIONS,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions)); 
// Apply CORS per route
app.use('/api/products', cors(corsOptions), productRoutes);
app.use('/api/employees', cors(corsOptions), employeeRoutes);
app.use('/api/orders', cors(corsOptions), orderRoutes);
app.use('/api/auth', cors(corsOptions), authRoutes);

// Preflight OPTIONS handling
app.options('/api/products', cors(corsOptions));
app.options('/api/orders', cors(corsOptions));
app.options('/api/employees', cors(corsOptions));
app.options('/api/auth', cors(corsOptions));
app.options('/api/auth/register', cors(corsOptions));
app.options('/api/auth/login', cors(corsOptions));


// Root
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Swagger added LAST
swaggerDocs(app);

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
