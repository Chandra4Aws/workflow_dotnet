
import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useWorkflow } from '../context/WorkflowContext'
import { BarChart3, PieChart, TrendingUp, Filter } from 'lucide-react'

export default function Reports() {
    const { user } = useAuth()
    const { workflows, templates } = useWorkflow()

    if (!user || user.role !== 'Admin') {
        return <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>Access Denied. Admins Only.</div>
    }

    // --- Statistics Calculations ---

    const totalRequests = workflows.length

    // Status Counts
    const statusCounts = workflows.reduce((acc, curr) => {
        const s = curr.status || 'Unknown'
        acc[s] = (acc[s] || 0) + 1
        return acc
    }, {})

    // Requests by Template (Workflow Type)
    // We group by Title since ID might link to instance, but Title comes from Template
    const typeCounts = workflows.reduce((acc, curr) => {
        const t = curr.title || 'Untitled'
        acc[t] = (acc[t] || 0) + 1
        return acc
    }, {})

    // Calculate percentages for bars
    const getPercent = (count) => Math.round((count / totalRequests) * 100) || 0

    // Colors for status
    const statusColors = {
        'Approved': 'var(--color-success)',
        'Rejected': 'var(--color-error)',
        'Pending Review': 'var(--color-warning)',
        'Pending Approval': 'var(--color-primary)',
        'Unknown': 'var(--color-text-muted)'
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>Administrator Reports</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                Overview of workflow performance and system usage.
            </p>

            {/* High Level Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-bg-element)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Requests</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{totalRequests}</h2>
                        </div>
                        <div style={{ padding: '10px', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', color: 'var(--color-primary)' }}>
                            <BarChart3 size={24} />
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-bg-element)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Active Templates</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{templates.length}</h2>
                        </div>
                        <div style={{ padding: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', color: 'var(--color-success)' }}>
                            <PieChart size={24} />
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-bg-element)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Completion Rate</p>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>
                                {Math.round(((statusCounts['Approved'] || 0) + (statusCounts['Rejected'] || 0)) / totalRequests * 100) || 0}%
                            </h2>
                        </div>
                        <div style={{ padding: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', color: 'var(--color-warning)' }}>
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                {/* Status Breakdown Chart */}
                <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-bg-element)' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Request Status Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {Object.entries(statusCounts).map(([status, count]) => {
                            const pct = getPercent(count)
                            return (
                                <div key={status}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 500 }}>{status}</span>
                                        <span style={{ color: 'var(--color-text-muted)' }}>{count} ({pct}%)</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-bg-element)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: statusColors[status] || 'var(--color-primary)' }}></div>
                                    </div>
                                </div>
                            )
                        })}
                        {Object.keys(statusCounts).length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No data available.</p>}
                    </div>
                </div>

                {/* Workflow Type Breakdown */}
                <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-bg-element)' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Requests by Type</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                            <div key={type} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.75rem',
                                backgroundColor: 'var(--color-bg-primary)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-bg-element)'
                            }}>
                                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{type}</span>
                                <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-primary)' }}>{count}</span>
                            </div>
                        ))}
                        {Object.keys(typeCounts).length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No data available.</p>}
                    </div>
                </div>
            </div>

            {/* Recent Table Preview or Details could go here */}
        </div>
    )
}
