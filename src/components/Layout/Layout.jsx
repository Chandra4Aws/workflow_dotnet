import React from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
    LayoutDashboard,
    FileText,
    CheckSquare,
    Users,
    BarChart3,
    LogOut,
    PlusCircle,
    Copy
} from 'lucide-react'

export default function Layout() {
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/workflows', label: 'My Workflows', icon: FileText },
        { path: '/workflows/templates', label: 'Templates', icon: Copy },
        { path: '/approvals', label: 'Approvals', icon: CheckSquare, hideFor: ['Creator'] },
        { path: '/users', label: 'Users', icon: Users, role: 'Admin' }, // Only for Admin
        { path: '/groups', label: 'Groups', icon: Users, role: 'Admin' }, // Only for Admin
        { path: '/reports', label: 'Reports', icon: BarChart3, role: 'Admin' },
    ]

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true
        if (path !== '/' && location.pathname.startsWith(path)) return true
        return false
    }

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: 'var(--color-bg-secondary)',
                borderRight: '1px solid var(--color-bg-element)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-bg-element)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            W
                        </div>
                        Regalis
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {navItems.map((item) => {
                            if (item.role) {
                                const currentRole = (user?.role || '').toString().toUpperCase();
                                const targetRole = item.role.toString().toUpperCase();
                                if (currentRole !== targetRole && currentRole !== `ROLE_${targetRole}`) return null;
                            }
                            if (item.hideFor) {
                                const currentRole = (user?.role || '').toString().toUpperCase();
                                if (item.hideFor.map(r => r.toUpperCase()).includes(currentRole) ||
                                    item.hideFor.map(r => `ROLE_${r.toUpperCase()}`).includes(currentRole)) return null;
                            }

                            const Icon = item.icon
                            const active = isActive(item.path)

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem 1rem',
                                        borderRadius: 'var(--radius-md)',
                                        textDecoration: 'none',
                                        color: active ? 'white' : 'var(--color-text-muted)',
                                        backgroundColor: active ? 'var(--color-primary)' : 'transparent',
                                        fontWeight: active ? 600 : 500,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>

                    {!(user?.role === 'Creator' || user?.role === 'Reviewer') && (
                        <div style={{ marginTop: '2rem', padding: '0 1rem' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>Create New</div>
                            <Link
                                to="/workflows/new"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    textDecoration: 'none',
                                    color: 'var(--color-primary)',
                                    border: '1px dashed var(--color-primary)',
                                    fontWeight: 500,
                                    justifyContent: 'center'
                                }}
                            >
                                <PlusCircle size={20} /> New Template
                            </Link>
                        </div>
                    )}
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--color-bg-element)' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            width: '100%',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'transparent',
                            color: 'var(--color-text-muted)',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left'
                        }}
                    >
                        <LogOut size={20} /> Logout
                    </button>
                    <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                        v0.1.0
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <header style={{
                    height: '64px',
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderBottom: '1px solid var(--color-bg-element)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '0 2rem',
                    gap: '1.5rem'
                }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{user?.email}</div>
                    </div>
                    <div style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        color: 'var(--color-primary)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {user?.role}
                    </div>
                </header>
                <div style={{ padding: '2rem', flex: 1 }}>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
