
import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWorkflow } from '../context/WorkflowContext'
import { Users as UsersIcon, Plus, Trash2, Shield, Mail, Edit2 } from 'lucide-react'

export default function Users() {
    const { user: currentUser } = useAuth()
    const { users, addUser, deleteUser, updateUserRole, updateUser, groups, updateUserGroups } = useWorkflow()
    const [showAddModal, setShowAddModal] = useState(false)
    const [showGroupsModal, setShowGroupsModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedGroupIds, setSelectedGroupIds] = useState([])

    // Form state for new user
    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newRole, setNewRole] = useState('Creator')
    const [newUserGroupIds, setNewUserGroupIds] = useState([])

    // Form state for edit user
    const [editEmail, setEditEmail] = useState('')
    const [editRole, setEditRole] = useState('')
    const [editGroupIds, setEditGroupIds] = useState([])

    // Access Control
    const isUserAdmin = (currentUser?.role || '').toString().toUpperCase().includes('ADMIN');
    if (!isUserAdmin) {
        return (
            <div style={{
                height: '50vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)'
            }}>
                <Shield size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h2>Access Restircted</h2>
                <p>Only Administrators can manage users.</p>
            </div>
        )
    }

    const handleAddUser = async (e) => {
        e.preventDefault()
        try {
            const newUser = await addUser({
                name: newName,
                email: newEmail,
                password: newPassword,
                role: newRole,
                groupIds: newUserGroupIds
            })

            // Groups are now assigned during creation by the backend

            setShowAddModal(false)
            setNewName('')
            setNewEmail('')
            setNewPassword('')
            setNewUserGroupIds([])
        } catch (err) {
            console.error('Failed to add user', err)
            alert('Failed to add user')
        }
    }

    const handleManageGroups = (user) => {
        setSelectedUser(user)
        setSelectedGroupIds(user.groups?.map(g => g.id) || [])
        setShowGroupsModal(true)
    }

    const handleSaveGroups = async () => {
        try {
            await updateUserGroups(selectedUser.id, selectedGroupIds)
            setShowGroupsModal(false)
            setSelectedUser(null)
            setSelectedGroupIds([])
        } catch (err) {
            alert('Failed to update user groups')
        }
    }

    const toggleGroup = (groupId) => {
        if (selectedGroupIds.includes(groupId)) {
            setSelectedGroupIds(selectedGroupIds.filter(id => id !== groupId))
        } else {
            setSelectedGroupIds([...selectedGroupIds, groupId])
        }
    }

    const toggleNewUserGroup = (groupId) => {
        if (newUserGroupIds.includes(groupId)) {
            setNewUserGroupIds(newUserGroupIds.filter(id => id !== groupId))
        } else {
            setNewUserGroupIds([...newUserGroupIds, groupId])
        }
    }

    const toggleEditGroup = (groupId) => {
        if (editGroupIds.includes(groupId)) {
            setEditGroupIds(editGroupIds.filter(id => id !== groupId))
        } else {
            setEditGroupIds([...editGroupIds, groupId])
        }
    }

    const handleEditUser = (user) => {
        setSelectedUser(user)
        setEditEmail(user.email || '')

        let roleName = 'Creator';
        const rawRole = user.roles?.[0]?.name || user.role;
        if (rawRole) {
            roleName = rawRole.toString().replace('ROLE_', '').toLowerCase();
            roleName = roleName.charAt(0).toUpperCase() + roleName.slice(1);
        }
        setEditRole(roleName)

        setEditGroupIds(user.groups?.map(g => g.id) || [])
        setShowEditModal(true)
    }

    const handleSaveEdit = async () => {
        try {
            // Update user details
            await updateUser(selectedUser.id, {
                email: editEmail
            })

            // Update role
            await updateUserRole(selectedUser.id, editRole)

            // Update groups
            await updateUserGroups(selectedUser.id, editGroupIds)

            setShowEditModal(false)
            setSelectedUser(null)
        } catch (err) {
            alert('Failed to update user')
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>User Management</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        fontWeight: 600
                    }}
                >
                    <Plus size={20} /> Add User
                </button>
            </div>

            {/* Add User Form/Modal (Simple inline for now) */}
            {showAddModal && (
                <div style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-primary)'
                }}>
                    <h3 style={{ marginBottom: '1rem' }}>Add New User</h3>
                    <form onSubmit={handleAddUser} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name</label>
                            <input
                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-element)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                                value={newName} onChange={e => setNewName(e.target.value)} required
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                            <input
                                type="email"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-element)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                                value={newEmail} onChange={e => setNewEmail(e.target.value)} required
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: '150px' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Password</label>
                            <input
                                type="password"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-element)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                                value={newPassword} onChange={e => setNewPassword(e.target.value)} required
                            />
                        </div>
                        <div style={{ width: '150px' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Role</label>
                            <select
                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-element)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                                value={newRole} onChange={e => setNewRole(e.target.value)}
                            >
                                <option value="Creator">Creator</option>
                                <option value="Reviewer">Reviewer</option>
                                <option value="Approver">Approver</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div style={{ width: '100%' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Assign Groups</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {groups.map(group => (
                                    <label key={group.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0.4rem 0.8rem',
                                        backgroundColor: newUserGroupIds.includes(group.id) ? 'rgba(var(--color-primary-rgb), 0.2)' : 'var(--color-bg-primary)',
                                        border: `1px solid ${newUserGroupIds.includes(group.id) ? 'var(--color-primary)' : 'var(--color-bg-element)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={newUserGroupIds.includes(group.id)}
                                            onChange={() => toggleNewUserGroup(group.id)}
                                            style={{ marginRight: '0.5rem' }}
                                        />
                                        {group.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--color-success)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>Save</button>
                        <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: 'var(--color-text-muted)', border: '1px solid var(--color-bg-element)', borderRadius: 'var(--radius-md)' }}>Cancel</button>
                    </form>
                </div>
            )}

            <div style={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-bg-element)',
                overflow: 'hidden'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1fr 0.5fr',
                    padding: '1rem 1.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderBottom: '1px solid var(--color-bg-element)',
                    fontWeight: 600,
                    color: 'var(--color-text-muted)',
                    fontSize: '0.875rem'
                }}>
                    <div>User</div>
                    <div>Email</div>
                    <div>Role</div>
                    <div>Groups</div>
                    <div>Status</div>
                    <div></div>
                </div>

                {users.map((u) => (
                    <div key={u.id} style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1fr 0.5fr',
                        padding: '1rem 1.5rem',
                        borderBottom: '1px solid var(--color-bg-element)',
                        alignItems: 'center',
                        fontSize: '0.95rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-bg-element)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-primary)'
                            }}>
                                <UsersIcon size={16} />
                            </div>
                            {u.name}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                            <Mail size={14} />
                            {u.email}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={14} color="var(--color-primary)" />
                            <select
                                value={u.role}
                                onChange={(e) => updateUserRole(u.id, e.target.value)}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    border: '1px solid var(--color-bg-element)',
                                    borderRadius: '4px',
                                    padding: '2px 4px',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <option value="Admin">Admin</option>
                                <option value="Creator">Creator</option>
                                <option value="Reviewer">Reviewer</option>
                                <option value="Approver">Approver</option>
                            </select>
                        </div>

                        <div>
                            <button
                                onClick={() => handleManageGroups(u)}
                                style={{
                                    padding: '4px 12px',
                                    fontSize: '0.8rem',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: 'var(--color-bg-element)',
                                    color: 'var(--color-primary)',
                                    border: '1px solid var(--color-primary)',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                                title="Manage Groups"
                            >
                                {u.groups?.length || 0} group{u.groups?.length !== 1 ? 's' : ''}
                            </button>
                        </div>

                        <div>
                            <span style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                backgroundColor: u.status === 'Active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                                color: u.status === 'Active' ? 'var(--color-success)' : 'var(--color-text-muted)',
                                fontSize: '0.8rem',
                                fontWeight: 600
                            }}>
                                {u.status}
                            </span>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <button
                                onClick={() => handleEditUser(u)}
                                style={{ padding: '4px', color: 'var(--color-text-muted)', opacity: 0.8, marginRight: '0.5rem' }}
                                title="Edit User"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => deleteUser(u.id)}
                                style={{ padding: '4px', color: 'var(--color-error)', opacity: 0.8 }}
                                title="Delete User"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Group Management Modal */}
            {showGroupsModal && selectedUser && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        width: '90%',
                        maxWidth: '500px',
                        border: '1px solid var(--color-bg-element)'
                    }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Manage Groups for {selectedUser.username}</h2>
                        <div style={{ marginBottom: '1.5rem' }}>
                            {groups.length === 0 ? (
                                <p style={{ color: 'var(--color-text-muted)' }}>No groups available. Create groups first.</p>
                            ) : (
                                groups.map(group => (
                                    <label key={group.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0.75rem',
                                        marginBottom: '0.5rem',
                                        backgroundColor: 'var(--color-bg-primary)',
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        border: '1px solid var(--color-bg-element)'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedGroupIds.includes(group.id)}
                                            onChange={() => toggleGroup(group.id)}
                                            style={{ marginRight: '0.75rem', cursor: 'pointer' }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 500 }}>{group.name}</div>
                                            {group.description && (
                                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                                    {group.description}
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                onClick={() => {
                                    setShowGroupsModal(false)
                                    setSelectedUser(null)
                                    setSelectedGroupIds([])
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-bg-element)',
                                    color: 'var(--color-text-muted)',
                                    fontWeight: 600
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveGroups}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    fontWeight: 600
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        width: '90%',
                        maxWidth: '500px',
                        border: '1px solid var(--color-bg-element)'
                    }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Edit User: {selectedUser.username}</h2>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                            <input
                                type="email"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-element)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                                value={editEmail} onChange={e => setEditEmail(e.target.value)}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Role</label>
                            <select
                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-element)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                                value={editRole} onChange={e => setEditRole(e.target.value)}
                            >
                                <option value="Creator">Creator</option>
                                <option value="Reviewer">Reviewer</option>
                                <option value="Approver">Approver</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Groups</label>
                            <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--color-bg-element)', borderRadius: 'var(--radius-md)', padding: '0.5rem' }}>
                                {groups.map(group => (
                                    <label key={group.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0.5rem',
                                        marginBottom: '0.25rem',
                                        cursor: 'pointer'
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={editGroupIds.includes(group.id)}
                                            onChange={() => toggleEditGroup(group.id)}
                                            style={{ marginRight: '0.75rem' }}
                                        />
                                        <span>{group.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                onClick={() => {
                                    setShowEditModal(false)
                                    setSelectedUser(null)
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-bg-element)',
                                    color: 'var(--color-text-muted)',
                                    fontWeight: 600
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    fontWeight: 600
                                }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
