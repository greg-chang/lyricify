'use client'
import { useEffect, useState } from 'react';
import DraggablePopup from './components/DraggablePopup';

export default function Home() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    
    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/auth/login');
            const data = await response.json();
            window.location.href = data.url;
        } catch (err) {
            setError('Failed to login');
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");
        
        if (code && state) {
            // Clear the code from the URL
            window.history.replaceState({}, document.title, "/");
            // Get profile using the code
            fetch(`http://localhost:5001/api/auth/callback?code=${code}&state=${state}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        throw new Error(data.error);
                    }
                    return fetch('http://localhost:5001/api/profile/me', {
                        headers: {
                            'Authorization': `Bearer ${data.access_token}`
                        }
                    });
                })
                .then(res => res.json())
                .then(data => setProfile(data))
                .catch(err => {
                    console.error('Error:', err);
                    setError('Failed to get profile');
                });
        }
    }, []);

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold mb-6">Spotify Profile</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {!profile ? (
                <button
                    onClick={handleLogin}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                    Login with Spotify
                </button>
            ) : (
                <>
                    <button
                        onClick={() => setShowPopup(!showPopup)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                        {showPopup ? 'Hide Profile' : 'Show Profile'}
                    </button>
                    {showPopup && (
                        <DraggablePopup
                            profile={profile}
                            onClose={() => setShowPopup(false)}
                        />
                    )}
                </>
            )}
        </main>
    );
}