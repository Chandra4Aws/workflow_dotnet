
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWorkflow } from '../context/WorkflowContext'
import { ArrowLeft, CheckCircle2, XCircle, FileText, User } from 'lucide-react'

export default function TaskDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { workflows, updateWorkflowStatus, downloadFile } = useWorkflow()
    // Derive workflow directly from context
    const workflow = workflows.find(w => w.id == id) || null

    // Original useEffect removed as we can just derive logic
    /* 
    useEffect(() => {
        const found = workflows.find(w => w.id === id)
        if (found) {
            setWorkflow(found)
        }
    }, [id, workflows]) 
    */

    if (!workflow) {
        return <div style={{ padding: '2rem' }}>Loading or Workflow not found...</div>
    }

    const handleAction = (status, actionLabel, extraData = {}) => {
        updateWorkflowStatus(id, status, user, actionLabel, extraData)
        navigate('/approvals') // or stay on page
    }

    const renderActions = () => {
        if (workflow.status === 'Approved' || workflow.status === 'Rejected') {
            return null
        }

        // Logic for role-based actions
        const isAssignedReviewer = workflow.reviewers && workflow.reviewers.some(rg => user.groups?.some(g => g.id === rg.id))
        const isAssignedApprover = workflow.approver && user.groups?.some(g => g.id === workflow.approver.id)
        const isAdmin = user.role === 'Admin'

        if (user.role === 'Reviewer' && workflow.status === 'Pending Review') {
            const matchingGroups = workflow.reviewers?.filter(rg => user.groups?.some(g => g.id === rg.id)) || []
            if (matchingGroups.length === 0 && !isAdmin) return <div style={{ marginTop: '2rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>This workflow is assigned to another reviewer group.</div>

            const handleReviewAction = (actionType) => {
                let currentStatuses = workflow.reviewerStatuses || {}
                let hasChanges = false;

                matchingGroups.forEach(rg => {
                    if (currentStatuses[rg.id] !== actionType) {
                        currentStatuses[rg.id] = actionType;
                        hasChanges = true;
                    }
                })

                if (!hasChanges) {
                    alert('You have already performed this action.');
                    return;
                }

                if (actionType === 'Rejected') {
                    handleAction('Rejected', 'Rejected during Review by ' + matchingGroups.map(g => g.name).join(', '), { reviewerStatuses: JSON.stringify(currentStatuses) })
                    return;
                }

                // If approved, check if all reviewers approved
                const allApproved = workflow.reviewers?.every(rg => currentStatuses[rg.id] === 'Approved')
                const nextStatus = allApproved ? 'Pending Approval' : 'Pending Review'

                handleAction(nextStatus, 'Review Approved by ' + matchingGroups.map(g => g.name).join(', '), { reviewerStatuses: JSON.stringify(currentStatuses) })
            }

            return (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button
                        onClick={() => handleReviewAction('Approved')}
                        style={{
                            flex: 1, padding: '1rem', backgroundColor: 'var(--color-success)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                        }}
                    >
                        <CheckCircle2 size={20} /> Approve for Final Sign-off
                    </button>
                    <button
                        onClick={() => handleReviewAction('Rejected')}
                        style={{
                            flex: 1, padding: '1rem', backgroundColor: 'var(--color-error)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                        }}
                    >
                        <XCircle size={20} /> Reject / Request Changes
                    </button>
                </div>
            )
        }

        if (user.role === 'Approver' && (workflow.status === 'Pending Approval' || workflow.status === 'Pending Review')) {
            if (!isAssignedApprover && !isAdmin) return <div style={{ marginTop: '2rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>This workflow is assigned to another approver group.</div>

            // Allowing Approver to override review for simplicity
            return (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button
                        onClick={() => handleAction('Approved', 'Final Approval Granted')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            backgroundColor: 'var(--color-success)',
                            color: 'white',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <CheckCircle2 size={20} /> Final Approval
                    </button>
                    <button
                        onClick={() => handleAction('Rejected', 'Final Approval Denied')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            backgroundColor: 'var(--color-error)',
                            color: 'white',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <XCircle size={20} /> Reject Workflow
                    </button>
                </div>
            )
        }

        if (user.role === 'Admin') {
            // Admin might have force buttons
            return (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button
                        onClick={() => handleAction('Approved', 'Admin Force Approve')}
                        style={{
                            flex: 1, padding: '1rem', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600
                        }}
                    >
                        Force Approve
                    </button>
                </div>
            )
        }

        return <div style={{ marginTop: '2rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No actions available for your role or assignment at this stage.</div>
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    color: 'var(--color-text-muted)'
                }}
            >
                <ArrowLeft size={20} /> Back
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-bg-element)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <h1 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>{workflow.title}</h1>
                        <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            backgroundColor: workflow.status === 'Approved' ? 'rgba(16, 185, 129, 0.2)' : workflow.status === 'Rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                            color: workflow.status === 'Approved' ? 'var(--color-success)' : workflow.status === 'Rejected' ? 'var(--color-error)' : 'var(--color-warning)',
                            fontSize: '0.875rem',
                            fontWeight: 600
                        }}>
                            {workflow.status}
                        </span>
                    </div>

                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
                        {workflow.description}
                    </p>

                    {workflow.formData && workflow.formData.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Form Data</h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: '1rem',
                                backgroundColor: 'var(--color-bg-primary)',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-bg-element)'
                            }}>
                                {workflow.formData.map(field => (
                                    <div key={field.id} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                                            {field.label || 'Untitled Field'}
                                        </label>
                                        <div style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>
                                            {field.value || '-'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Attached Files</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                        {workflow.files && workflow.files.map((file, idx) => (
                            <button
                                key={idx}
                                onClick={() => downloadFile(file.fileName, file.originalName || file.name)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-bg-element)',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    textAlign: 'left'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-bg-element)'}
                            >
                                <FileText size={24} color="var(--color-primary)" style={{ marginRight: '1rem' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500 }}>{file.originalName || file.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                        {Math.round(file.size / 1024)} KB
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 500 }}>
                                    Download
                                </div>
                            </button>
                        ))}
                        {(!workflow.files || workflow.files.length === 0) && <div style={{ color: 'var(--color-text-muted)' }}>No attachments.</div>}
                    </div>

                    {workflow.reviewers && workflow.reviewers.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Reviewer Approvals</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {workflow.reviewers.map(rg => {
                                    const statuses = workflow.reviewerStatuses || {}
                                    const status = statuses[rg.id] || 'Pending'
                                    let statusColor = 'var(--color-warning)'
                                    if (status === 'Approved') statusColor = 'var(--color-success)'
                                    if (status === 'Rejected') statusColor = 'var(--color-error)'

                                    return (
                                        <div key={rg.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-element)' }}>
                                            <span style={{ fontWeight: 500 }}>{rg.name}</span>
                                            <span style={{ color: statusColor, fontWeight: 600, fontSize: '0.9rem' }}>{status}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {workflow.approver && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Final Approval</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-element)' }}>
                                <span style={{ fontWeight: 500 }}>{workflow.approver.name || workflow.approver}</span>
                                <span style={{
                                    color: workflow.status === 'Approved' ? 'var(--color-success)' : workflow.status === 'Rejected' ? 'var(--color-error)' : 'var(--color-warning)',
                                    fontWeight: 600,
                                    fontSize: '0.9rem'
                                }}>
                                    {workflow.status === 'Approved' ? 'Approved' : workflow.status === 'Rejected' ? 'Rejected' : 'Pending'}
                                </span>
                            </div>
                        </div>
                    )}

                    {renderActions()}
                </div>

                <div>
                    <div style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-bg-element)'
                    }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timeline</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {workflow.timeline && workflow.timeline.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                                    {idx !== workflow.timeline.length - 1 && (
                                        <div style={{
                                            position: 'absolute',
                                            left: '12px',
                                            top: '24px',
                                            bottom: '-24px',
                                            width: '2px',
                                            backgroundColor: 'var(--color-bg-element)'
                                        }} />
                                    )}
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--color-bg-element)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        zIndex: 1
                                    }}>
                                        <User size={14} color="var(--color-text-muted)" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.action}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                            by <span style={{ color: 'var(--color-primary)' }}>{item.user}</span> ({item.role})
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{item.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
