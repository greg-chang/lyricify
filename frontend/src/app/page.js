'use client'
import { useEffect, useState } from 'react';
export default function Home() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/login');
            const data = await response.json();
            window.location.href = data.url;
        } catch (err) {
            setError('Failed to login');
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        
        if (success === 'true') {
            fetch('http://localhost:5001/api/me')
                .then(res => res.json())
                .then(data => setProfile(data))
                .catch(err => setError('Failed to get profile'));
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
                <section className="space-y-4">
                    <div className="flex items-center gap-4">
                        {profile.images?.[0]?.url && (
                            <img 
                                src={profile.images[0].url} 
                                alt="Profile" 
                                className="w-16 h-16 rounded-full"
                            />
                        )}
                        <h2 className="text-xl font-semibold">
                            {profile.display_name}
                        </h2>
                    </div>
                    <ul className="space-y-2">
                        <li>Email: {profile.email}</li>
                        <li>Spotify URI: <a href={profile.uri} className="text-green-500 hover:underline">{profile.uri}</a></li>
                        <li>Profile Link: <a href={profile.external_urls?.spotify} className="text-green-500 hover:underline" target="_blank" rel="noopener noreferrer">Open in Spotify</a></li>
                        <li>Followers: {profile.followers?.total}</li>
                    </ul>
                </section>
            )}
        </main>
    );
}