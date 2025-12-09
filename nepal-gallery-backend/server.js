const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path'); // <--- Add this
const connectDB = require('./config/db');

// Route files
const galleryRoutes = require('./routes/galleryRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
// app.use(helmet());

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));

// Mount Routers
app.use('/api/galleries', galleryRoutes);
app.use('/api/auth', authRoutes); // <--- Add this

// Serve 'uploads' folder as static files (so you can see local images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple health-check endpoint for Render
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});