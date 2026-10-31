const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
let databaseConnection;

const connectDatabase = () => {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }

  if (mongoose.connection.readyState === 0) {
    databaseConnection = null;
  }

  if (!databaseConnection) {
    if (!process.env.MONGO_URI) {
      return Promise.reject(new Error('MONGO_URI is not configured'));
    }

    databaseConnection = mongoose.connect(process.env.MONGO_URI)
      .then(() => {
        console.log('MongoDB Atlas Connected');
      })
      .catch((error) => {
        databaseConnection = null;
        throw error;
      });
  }

  return databaseConnection;
};

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    res.status(503).json({ message: 'Database is unavailable' });
  }
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/trash', require('./routes/trash'));
app.use('/api/gemini', require('./routes/gemini'));

app.get('/', (req, res) => {
  res.send('TrackHire Backend Running');
});

module.exports = { app, connectDatabase };
