import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useWorkflow } from '../context/WorkflowContext'
import { BarChart3, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react'

export default function Dashboard() {
    const { user } = useAuth()
    const { workflows } = useWorkflow()

    // Calculate stats
    const pendingReviewCount = workflows.filter(w => w.status === 'Pending Review').length
    const pendingApprovalCount = workflows.filter(w => w.status === 'Pending Approval').length
    const approvedCount = workflows.filter(w => w.status === 'Approved').length
    const rejectedCount = workflows.filter(w => w.status === 'Rejected').length
    const totalCount = workflows.length

    const stats = [
        { label: 'Pending Review', value: pendingReviewCount, icon: Clock, color: 'var(--color-warning)' },
        { label: 'Pending Approval', value: pendingApprovalCount, icon: CheckCircle2, color: 'var(--color-primary)' },
        { label: 'Approved', value: approvedCount, icon: CheckCircle2, color: 'var(--color-success)' },
        { label: 'Rejected', value: rejectedCount, icon: AlertCircle, color: 'var(--color-error)' },
    ]

    // Get recent activity (flat list of all timeline events from all workflows)
    const recentActivity = workflows.flatMap(w => w.timeline.map(t => ({ ...t, workflowTitle: w.title })))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)

    return (
        <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Dashboard</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                Welcome back, <strong style={{ color: 'var(--color-text-main)' }}>{user?.name}</strong>.
                You are logged in as <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    color: 'var(--color-primary)',
                    fontSize: '0.85rem'
                }}>{user?.role}</span>
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {stats.map((stat) => (
                    <div key={stat.label} style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-bg-element)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{
                            padding: '12px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: stat.color
                        }}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</div>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                backgroundColor: 'var(--color-bg-secondary)',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-bg-element)',
                minHeight: '300px'
            }}>
                <h2 style={{ marginBottom: '1rem' }}>Recent Activity</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {recentActivity.length > 0 ? recentActivity.map((activity, idx) => (
                        <div key={idx} style={{
                            padding: '1rem',
                            borderBottom: '1px solid var(--color-bg-element)',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-bg-element)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FileText size={18} color="var(--color-primary)" />
                            </div>
                            <div>
                                <div style={{ fontWeight: 500 }}>{activity.workflowTitle}</div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                    {activity.action} by <span style={{ color: 'var(--color-text-main)' }}>{activity.user}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{activity.date}</div>
                                {activity.reviewerGroups && activity.reviewerGroups.length > 0 && activity.status === 'Pending Review' && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-warning)', marginTop: '2px' }}>
                                        {Object.values(typeof activity.reviewerStatuses === 'string' ? JSON.parse(activity.reviewerStatuses) : (activity.reviewerStatuses || {})).filter(s => s === 'Approved').length} / {activity.reviewerGroups.length} Reviewers Approved
                                    </div>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No recent activity.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
