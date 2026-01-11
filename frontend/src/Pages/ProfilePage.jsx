import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            {user ? (
                <div>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            ) : (
                <p>You are not logged in.</p>
            )}
        </div>
    )
}

export default ProfilePage
