import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import nodemailer from 'nodemailer';

import trip from './models/trips.js';

import trips from './models/user.js';


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Replace <your_password> and <your_db_name> with your actual MongoDB credentials and DB name
const mongoUri =
  'mongodb+srv://kanhchana:<db_password>@cluster0.v8dud5t.mongodb.net/';

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((err) => {
    console.log('MongoDB connection error', err);
    process.exit(1);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Trip Planner API');
});

// Create Trip Endpoint
app.post('/api/trips', async (req, res) => {
  try {
    const {
      tripName,
      startDate,
      endDate,
      startDay,
      endDay,
      background,
      budget = 0,
      expenses = [],
      placesToVisit = [],
      itinerary = [],
      travelers = [],
      clerkUserId,
      userData = {},
    } = req.body;

    if (!clerkUserId) {
      return res.status(401).json({ error: 'User ID is required' });
    }
    if (!tripName || !startDate || !endDate || !startDay || !endDay || !background) {
      return res.status(400).json({ error: 'Missing required trip fields' });
    }

    let user = await User.findOne({ clerkUserId });
    if (!user) {
      const { email, name } = userData;
      if (!email) {
        return res.status(400).json({ error: 'User email is required' });
      }
      user = new User({ clerkUserId, email, name });
      await user.save();
    }

    const trip = new Trip({
      tripName,
      startDate,
      endDate,
      startDay,
      endDay,
      background,
      host: user._id,
      travelers: [user._id, ...travelers],
      budget,
      expenses,
      placesToVisit,
      itinerary,
    });

    await trip.save();
    res.status(201).json({ message: 'Trip created successfully', trip });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// Get Trips for Current User Endpoint
app.get('/api/trips', async (req, res) => {
  try {
    const { clerkUserId, email } = req.query;
    if (!clerkUserId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    let user = await User.findOne({ clerkUserId });
    if (!user) {
      if (!email) {
        return res.status(400).json({ error: 'User email is required' });
      }
      user = new User({ clerkUserId, email: email.toString(), name: '' });
      await user.save();
    }

    const trips = await Trip.find({
      $or: [{ host: user._id }, { travelers: user._id }],
    }).populate('host travelers');
    res.status(200).json({ trips });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});