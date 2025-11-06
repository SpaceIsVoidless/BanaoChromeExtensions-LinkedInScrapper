const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', profileRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'LinkedIn Profile Scraper API',
    endpoints: {
      'POST /api/profiles': 'Create a new profile',
      'GET /api/profiles': 'Get all profiles',
      'GET /api/profiles/:id': 'Get a single profile',
      'DELETE /api/profiles/:id': 'Delete a profile',
      'DELETE /api/profiles/cleanup/errors': 'Delete all error profiles'
    },
    dashboard: 'Visit /dashboard to view profiles'
  });
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('API endpoints:');
      console.log(`  POST   http://localhost:${PORT}/api/profiles`);
      console.log(`  GET    http://localhost:${PORT}/api/profiles`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to database:', err);
  });

module.exports = app;
