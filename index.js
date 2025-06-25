const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// In-memory fallback DB file
const DB_FILE = './bookings.json';

// Home route
app.get('/', (req, res) => {
  res.send(' Welcome to the Ticket Booking App!');
});

// Book a ticket
app.post('/book', async (req, res) => {
  const { name, event } = req.body;
  if (!name || !event) {
    return res.status(400).send('Missing name or event!');
  }

  const bookings = await fs.readJson(DB_FILE).catch(() => []);
  bookings.push({ name, event, time: new Date().toISOString() });
  await fs.writeJson(DB_FILE, bookings, { spaces: 2 });

  res.send(' Ticket booked successfully!');
});

// View all bookings
app.get('/bookings', async (req, res) => {
  const bookings = await fs.readJson(DB_FILE).catch(() => []);
  res.json(bookings);
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
