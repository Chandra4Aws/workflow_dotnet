
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWorkflow } from '../context/WorkflowContext'
import { Plus, FileText, Settings, ArrowRight, Trash2, Edit } from 'lucide-react'

export default function TemplateList() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { templates, deleteTemplate } = useWorkflow()

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete the "${title}" template? (This will only work if there are no active/pending requests associated with it)`)) {
            try {
                await deleteTemplate(id)
            } catch (err) {
                alert(err.message)
            }
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Start New Workflow</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Select a template to begin a new request.</p>
                </div>

                {!(user?.role === 'Creator' || user?.role === 'Reviewer') && (
                    <button
                        onClick={() => navigate('/workflows/new')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--color-bg-secondary)',
                            color: 'var(--color-text-main)',
                            border: '1px solid var(--color-bg-element)',
                            fontWeight: 600
                        }}
                    >
                        <Settings size={20} /> Design New Template
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {templates.map((template) => (
                    <div key={template.id} style={{
                        backgroundColor: 'var(--color-bg-secondary)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-bg-element)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%'
                    }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    padding: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                    color: 'var(--color-primary)'
                                }}>
                                    <FileText size={24} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{template.title}</h3>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {(user?.role === 'Admin' || user?.role === 'Creator') && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/workflows/edit/${template.id}`);
                                                }}
                                                style={{
                                                    padding: '4px',
                                                    color: 'var(--color-text-muted)',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                                title="Edit Template"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        )}
                                        {user?.role === 'Admin' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(template.id, template.title);
                                                }}
                                                style={{
                                                    padding: '4px',
                                                    color: 'var(--color-error)',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    opacity: 0.7,
                                                    cursor: 'pointer'
                                                }}
                                                title="Delete Template"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                                {template.description}
                            </p>
                        </div>

                        <button
                            onClick={() => navigate(`/workflows/submit/${template.id}`)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            Start Request <ArrowRight size={18} />
                        </button>
                    </div>
                ))}

                {/* Always show Empty State or "Ad Hoc" option if no templates */}
                {templates.length === 0 && (
                    <div style={{
                        gridColumn: '1 / -1',
                        padding: '4rem',
                        textAlign: 'center',
                        backgroundColor: 'var(--color-bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px dashed var(--color-bg-element)',
                        color: 'var(--color-text-muted)'
                    }}>
                        <p style={{ marginBottom: '1rem' }}>No templates available yet.</p>
                        {!(user?.role === 'Creator' || user?.role === 'Reviewer') && (
                            <button
                                onClick={() => navigate('/workflows/new')}
                                style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'underline', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                            >
                                Create the first template
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div >
    )
}
