const express = require('express');
const router = express.Router();

router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        if (response.ok) {
            res.json(data);
        } else {
            throw new Error(data.error?.message || 'Failed to get profile');
        }
    } catch (err) {
        console.error('Error getting user profile:', err);
        res.status(400).json({ error: 'Failed to get user profile' });
    }
});

router.get('/saved-tracks', async (req, res) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const response = await fetch('https://api.spotify.com/v1/me/tracks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        if (response.ok) {
            res.json(data);
        } else {
            throw new Error(data.error?.message || 'Failed to get saved tracks');
        }
    } catch (err) {
        console.error('Error getting saved tracks:', err);
        res.status(400).json({ error: 'Failed to get saved tracks' });
    }
});

module.exports = router;