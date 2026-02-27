import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useWorkflow } from '../context/WorkflowContext'
import { Users as UsersIcon, Plus, Edit2, Trash2, X } from 'lucide-react'

export default function Groups() {
    const { user } = useAuth()
    const { groups, fetchGroups, createGroup, updateGroup, deleteGroup } = useWorkflow()
    const [showModal, setShowModal] = useState(false)
    const [editingGroup, setEditingGroup] = useState(null)
    const [formData, setFormData] = useState({ name: '', description: '' })

    useEffect(() => {
        fetchGroups()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingGroup) {
                await updateGroup(editingGroup.id, formData)
            } else {
                await createGroup(formData)
            }
            setShowModal(false)
            setEditingGroup(null)
            setFormData({ name: '', description: '' })
        } catch (err) {
            alert(err.message || 'Failed to save group')
        }
    }

    const handleEdit = (group) => {
        setEditingGroup(group)
        setFormData({ name: group.name, description: group.description || '' })
        setShowModal(true)
    }

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete the "${name}" group?`)) {
            try {
                await deleteGroup(id)
            } catch (err) {
                alert(err.message || 'Failed to delete group')
            }
        }
    }

    const handleCancel = () => {
        setShowModal(false)
        setEditingGroup(null)
        setFormData({ name: '', description: '' })
    }

    const isUserAdmin = (user?.role || '').toString().toUpperCase().includes('ADMIN');
    if (!isUserAdmin) {
        return <div style={{ padding: '2rem' }}>Access denied. Admin privileges required.</div>
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Groups</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                        Manage user groups and organize team members.
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
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
                    <Plus size={20} /> Create Group
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {groups.map((group) => (
                    <div key={group.id} style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-bg-element)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    padding: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                    color: 'var(--color-primary)'
                                }}>
                                    <UsersIcon size={20} />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{group.name}</h3>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => handleEdit(group)}
                                    style={{
                                        padding: '4px',
                                        color: 'var(--color-primary)',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                    title="Edit Group"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(group.id, group.name)}
                                    style={{
                                        padding: '4px',
                                        color: 'var(--color-error)',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                    title="Delete Group"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            {group.description || 'No description'}
                        </p>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                            {group.members?.length || 0} member{group.members?.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                ))}

                {groups.length === 0 && (
                    <div style={{
                        gridColumn: '1 / -1',
                        padding: '4rem',
                        textAlign: 'center',
                        backgroundColor: 'var(--color-bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px dashed var(--color-bg-element)',
                        color: 'var(--color-text-muted)'
                    }}>
                        <p>No groups created yet. Click "Create Group" to get started.</p>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2>{editingGroup ? 'Edit Group' : 'Create New Group'}</h2>
                            <button onClick={handleCancel} style={{ padding: '4px', color: 'var(--color-text-muted)' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Group Name <span style={{ color: 'var(--color-error)' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        backgroundColor: 'var(--color-bg-primary)',
                                        border: '1px solid var(--color-bg-element)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--color-text-main)'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        backgroundColor: 'var(--color-bg-primary)',
                                        border: '1px solid var(--color-bg-element)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--color-text-main)',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={handleCancel}
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
                                    type="submit"
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'white',
                                        fontWeight: 600
                                    }}
                                >
                                    {editingGroup ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
