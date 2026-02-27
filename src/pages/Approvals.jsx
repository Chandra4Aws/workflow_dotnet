import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWorkflow } from '../context/WorkflowContext'
import { CheckSquare, ChevronRight, Clock } from 'lucide-react'

export default function Approvals() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { workflows } = useWorkflow()

    // Access Control
    if (user?.role === 'Creator') {
        return (
            <div style={{
                height: '50vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)'
            }}>
                <Clock size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h2>Access Restricted</h2>
                <p>Creators do not have permission to access the Approvals page.</p>
            </div>
        )
    }

    const approvals = workflows.filter(wf => {
        const isAssignedReviewer = wf.reviewerGroups && wf.reviewerGroups.some(rg => user.groups?.some(g => g.id === rg.id))
        const isAssignedApprover = wf.approverGroup && user.groups?.some(g => g.id === wf.approverGroup.id)
        const isAdmin = user.role === 'Admin'

        if (user.role === 'Reviewer') return wf.status === 'Pending Review' && (isAssignedReviewer || isAdmin)
        if (user.role === 'Approver') return (wf.status === 'Pending Approval' || wf.status === 'Pending Review') && (isAssignedApprover || isAdmin)
        if (user.role === 'Admin') return wf.status === 'Pending Review' || wf.status === 'Pending Approval'

        // Also allow if user has the role AND is in the group, regardless of specifically identifying as "Reviewer" role?
        // The prompt implies we are just switching assignment. 
        // Logic: If status is Pending Review AND I am in Reviewer Group -> Show.
        if (wf.status === 'Pending Review' && isAssignedReviewer) return true
        if (wf.status === 'Pending Approval' && isAssignedApprover) return true

        return false
    })

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Pending Approvals</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {approvals.map((wf) => (
                    <div key={wf.id} style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-bg-element)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }}
                        onClick={() => navigate(`/workflows/${wf.id}`)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                padding: '10px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                                color: 'var(--color-secondary)'
                            }}>
                                <CheckSquare size={24} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{wf.title}</div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Requested by: {wf.creator?.username || wf.creator}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-warning)' }}>
                                <Clock size={16} />
                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Action Required</span>
                            </div>
                            <ChevronRight color="var(--color-text-muted)" />
                        </div>
                    </div>
                ))}
                {approvals.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                        No pending approvals found.
                    </div>
                )}
            </div>
        </div>
    )
}
