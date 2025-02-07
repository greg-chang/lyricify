import { useState, useEffect } from "react";

export default function DraggablePopup({ profile, onClose }) {
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            className="fixed bg-white rounded-lg shadow-lg p-6 w-80"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
        >
            <div
                className="bg-gray-100 p-2 mb-4 rounded cursor-grab"
                onMouseDown={handleMouseDown}
            >
                <div className="flex justify-between items-center">
                    <span className="font-semibold">Profile Details</span>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div className="space-y-4">
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
            </div>
        </div>
    );
}

