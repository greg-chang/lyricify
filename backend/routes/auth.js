const express = require('express');
const router = express.Router();
const spotifyApi = require('../config/spotify');

router.get('/login', (req, res) => {
    const scopes = [
        'user-read-private',
        'user-read-email'
    ];
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    res.json({ url: authorizeURL });
});

router.get('/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        spotifyApi.setAccessToken(data.body.access_token);
        spotifyApi.setRefreshToken(data.body.refresh_token);
        res.redirect('http://localhost:3000?success=true');
    } catch (err) {
        console.error('Error in callback:', err);
        res.redirect('http://localhost:3000?error=true');
    }
});

module.exports = router;