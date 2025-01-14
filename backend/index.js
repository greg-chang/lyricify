const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI
});

app.get('/api/login', (req, res) => {
    const scopes = [
        'user-read-private',
        'user-read-email'
    ];
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    res.json({ url: authorizeURL });
});

app.get('/api/callback', async (req, res) => {
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

app.get('/api/me', async (req, res) => {
    try {
        const data = await spotifyApi.getMe();
        res.json(data.body);
    } catch (err) {
        console.error('Error getting user profile:', err);
        res.status(400).json({ error: 'Failed to get user profile' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});