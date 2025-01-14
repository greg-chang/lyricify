const express = require('express');
const router = express.Router();
const spotifyApi = require('../config/spotify');

router.get('/me', async (req, res) => {
    try {
        const data = await spotifyApi.getMe();
        res.json(data.body);
    } catch (err) {
        console.error('Error getting user profile:', err);
        res.status(400).json({ error: 'Failed to get user profile' });
    }
});

module.exports = router;