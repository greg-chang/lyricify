const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const credentials = require('../config/spotify');


// Generate random string for state
const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

// Login route
router.get('/login', (req, res) => {
    if (!credentials.clientId || !credentials.clientSecret) {
        console.error('Missing credentials:', {
            hasClientId: !!credentials.clientId,
            hasClientSecret: !!credentials.clientSecret,
            redirectUri: credentials.redirectUri
        });
        return res.status(500).json({ error: 'Invalid configuration' });
    }

    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email user-library-read';

    const queryParams = querystring.stringify({
        client_id: credentials.clientId,
        response_type: 'code',
        redirect_uri: credentials.redirectUri,
        state: state,
        scope: scope
    });
    // for debugging
    console.log('Authorization URL params:', {
        clientIdLength: credentials.clientId?.length,
        redirectUri: credentials.redirectUri,
        state,
        scope
    });

    res.json({ url: `https://accounts.spotify.com/authorize?${queryParams}` });
});

// Callback route
router.get('/callback', async (req, res) => {
    console.log('Received callback with params:', {
        code: req.query.code ? 'Present' : 'Missing',
        state: req.query.state ? 'Present' : 'Missing'
    });

    const code = req.query.code || null;
    const state = req.query.state || null;

    if (state === null) {
        res.status(400).json({ error: 'State mismatch' });
        return;
    }

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(credentials.clientId + ':' + credentials.clientSecret).toString('base64')
            },
            body: querystring.stringify({
                code: code,
                redirect_uri: credentials.redirectUri,
                grant_type: 'authorization_code'
            })
        });

        const data = await response.json();
        console.log('Token response:', {
            status: response.status,
            ok: response.ok,
            error: data.error,
            error_description: data.error_description
        });

        if (response.ok) {
            res.json(data);
        } else {
            throw new Error(data.error_description || 'Failed to get token');
        }
    } catch (err) {
        console.error('Error getting token:', err);
        res.status(400).json({ error: 'Failed to get token' });
    }
});

module.exports = router;