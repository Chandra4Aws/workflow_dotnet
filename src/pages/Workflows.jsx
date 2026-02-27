import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflow } from '../context/WorkflowContext'
import { Plus, FileText, ChevronRight } from 'lucide-react'

export default function Workflows() {
    const navigate = useNavigate()
    const { workflows } = useWorkflow()

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Workflows</h1>
                <button
                    onClick={() => navigate('/workflows/templates')}
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
                    <Plus size={20} /> New Request
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {workflows.map((wf) => (
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
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                color: 'var(--color-primary)'
                            }}>
                                <FileText size={24} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{wf.title}</div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Created: {new Date(wf.submittedDate).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    backgroundColor: wf.status === 'Approved' ? 'rgba(16, 185, 129, 0.2)' : wf.status === 'Rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                    color: wf.status === 'Approved' ? 'var(--color-success)' : wf.status === 'Rejected' ? 'var(--color-error)' : 'var(--color-warning)',
                                    fontSize: '0.85rem',
                                    fontWeight: 600
                                }}>
                                    {wf.status}
                                </span>
                                {wf.status === 'Pending Review' && wf.reviewerGroups && wf.reviewerGroups.length > 0 && (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                        {Object.values(wf.reviewerStatuses || {}).filter(s => s === 'Approved').length} / {wf.reviewerGroups.length} Reviewers Approved
                                    </span>
                                )}
                                {wf.status === 'Pending Approval' && wf.approver && (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                        Awaiting: {wf.approver.name || wf.approver}
                                    </span>
                                )}
                            </div>
                            <ChevronRight color="var(--color-text-muted)" size={20} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
