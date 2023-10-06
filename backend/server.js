const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Import cookie-parser
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the process with a failure code
  });

// Middleware
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

// CORS Configuration
const corsOptions = {
  origin: [
    'https://www.totalplay.io',
    'http://localhost:3000',
    'https://auth.magic.link',
    'https://api.magic.link',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Handle OPTIONS requests for preflight
app.options('*', cors(corsOptions));

/*// Proxy middleware for Sepolia network
app.use('/sepolia', createProxyMiddleware({
  target: 'https://rpc2.sepolia.org',
  changeOrigin: true,
  pathRewrite: {
    '^/sepolia': '/', // remove base path
  },
}));*/

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
