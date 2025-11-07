const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

router.post('/profiles', async (req, res) => {
  try {
    const { name, url, about, bio, location, follower_count, connection_count } = req.body;

    const existingProfile = await Profile.findOne({ where: { url } });
    
    if (existingProfile) {
      const updated = await existingProfile.update({
        name,
        about,
        bio,
        location,
        follower_count,
        connection_count
      });
      return res.status(200).json({
        message: 'Profile updated',
        profile: updated
      });
    }

    const profile = await Profile.create({
      name,
      url,
      about,
      bio,
      location,
      follower_count,
      connection_count
    });

    res.status(201).json({
      message: 'Profile created successfully',
      profile
    });
  } catch (err) {
    console.error('Error saving profile:', err);
    res.status(400).json({ 
      error: err.message,
      details: err.errors ? err.errors.map(e => e.message) : []
    });
  }
});

router.get('/profiles', async (req, res) => {
  try {
    const profiles = await Profile.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({
      count: profiles.length,
      profiles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/profiles/:id', async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/profiles/:id', async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    await profile.destroy();
    res.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/profiles/cleanup/errors', async (req, res) => {
  try {
    const deleted = await Profile.destroy({
      where: {
        name: ['Error', 'Scraping Error', 'Unknown User']
      }
    });
    res.json({ 
      message: 'Error profiles cleaned up',
      deletedCount: deleted 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/profiles/all', async (req, res) => {
  try {
    const deleted = await Profile.destroy({
      where: {},
      truncate: true
    });
    res.json({ 
      message: 'All profiles deleted',
      deletedCount: deleted 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
