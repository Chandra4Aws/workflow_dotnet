import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const API_URL = 'http://localhost:5052/api/auth/'

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('workflow_user')
        if (!storedUser) return null;

        const parsedUser = JSON.parse(storedUser);
        // Robust role migration: Ensure role is in 'Admin', 'Creator' format
        if (parsedUser.role && parsedUser.role.startsWith('ROLE_')) {
            const roleName = parsedUser.role.replace('ROLE_', '');
            parsedUser.role = roleName.toLowerCase().charAt(0).toUpperCase() + roleName.toLowerCase().slice(1);
            localStorage.setItem('workflow_user', JSON.stringify(parsedUser));
        }
        return parsedUser;
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const login = async (username, password) => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${API_URL}signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Login failed')
            }

            const rolesList = data.roles || [];
            const roleStrings = rolesList.map(r => (typeof r === 'object' ? r.name : r));

            let rawRole = 'ROLE_CREATOR';
            if (roleStrings.includes('ROLE_ADMIN')) rawRole = 'ROLE_ADMIN';
            else if (roleStrings.includes('ROLE_APPROVER')) rawRole = 'ROLE_APPROVER';
            else if (roleStrings.includes('ROLE_REVIEWER')) rawRole = 'ROLE_REVIEWER';
            else if (roleStrings.length > 0) rawRole = roleStrings[0];

            const roleName = (rawRole || 'ROLE_CREATOR').replace('ROLE_', '');
            const finalRole = roleName.toLowerCase().charAt(0).toUpperCase() + roleName.toLowerCase().slice(1);

            const newUser = {
                id: data.id,
                name: data.username,
                email: data.email,
                role: finalRole,
                token: data.token,
                groups: data.groups,
                avatar: `https://ui-avatars.com/api/?name=${data.username}&background=random`
            }

            setUser(newUser)
            localStorage.setItem('workflow_user', JSON.stringify(newUser))
            return newUser
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('workflow_user')
    }

    const value = {
        user,
        login,
        logout,
        loading,
        error
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
