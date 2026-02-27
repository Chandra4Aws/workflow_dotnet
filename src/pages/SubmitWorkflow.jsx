
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWorkflow } from '../context/WorkflowContext'
import FileUpload from '../components/FileUpload'
import { ArrowLeft, Send, FileText } from 'lucide-react'

export default function SubmitWorkflow() {
    const { templateId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { templates, addWorkflow, downloadFile } = useWorkflow()

    // Derived state directly from context
    const template = templates.find(t => t.id == templateId) || null

    // Restore missing state definitions
    const [formData, setFormData] = useState([])
    const [files, setFiles] = useState([])

    // Initialize formData when template changes. 
    // We use a useEffect to sync formData, but we must protect against infinite loops or unnecessary sets.
    // Better pattern: Initialize state when templateId changes using a key on the parent or careful effect usage.
    // However, given the existing architecture, we'll keep the effect but strictly guard it.
    useEffect(() => {
        if (template && template.formSchema) {
            setFormData(template.formSchema.map(field => ({
                ...field,
                value: field.type === 'checkbox' ? 'false' : ''
            })))
        }
    }, [templateId, template]) // Re-run when templateId changes or template loads

    const handleFieldChange = (id, newValue) => {
        setFormData(formData.map(f => f.id === id ? { ...f, value: newValue } : f))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!template) return

        // Files are already uploaded and contain server metadata
        const workflowData = {
            templateId: template.id,
            title: template.title,
            description: template.description,
            files: files, // Already contains server metadata from upload
            formData: formData
        }

        await addWorkflow(workflowData, user)
        navigate('/')
    }

    if (!template) return <div style={{ padding: '2rem' }}>Loading template...</div>

    // Debug logging to check template files
    console.log('Template data:', template)
    console.log('Template files:', template.files)
    console.log('Template files type:', typeof template.files)
    console.log('Template files length:', template.files?.length)

    const renderFieldInput = (field) => {
        const inputStyle = {
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'var(--color-bg-primary)',
            border: '1px solid var(--color-bg-element)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-main)',
            fontSize: '1rem',
            marginTop: '0.5rem'
        }

        switch (field.type) {
            case 'text':
            case 'number':
            case 'date':
                return (
                    <input
                        type={field.type}
                        value={field.value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={`Enter ${field.label}`}
                        style={inputStyle}
                        required={field.required}
                    />
                )
            case 'select': {
                const opts = field.options ? field.options.split(',').map(s => s.trim()) : []
                return (
                    <select
                        value={field.value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        style={inputStyle}
                        required={field.required}
                    >
                        <option value="">Select...</option>
                        {opts.map((o, i) => (
                            <option key={i} value={o}>{o}</option>
                        ))}
                    </select>
                )
            }
            case 'checkbox':
                return (
                    <div style={{ marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={field.value === 'true'}
                                onChange={(e) => handleFieldChange(field.id, e.target.checked ? 'true' : 'false')}
                                style={{ width: '20px', height: '20px' }}
                            />
                            <span style={{ fontSize: '1rem' }}>Yes</span>
                        </label>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
                <ArrowLeft size={20} /> Cancel
            </button>

            <div style={{
                backgroundColor: 'var(--color-bg-secondary)',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-bg-element)'
            }}>
                <h1 style={{ marginBottom: '0.5rem' }}>{template.title}</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    {template.description}
                </p>

                {/* Reference Attachments from Template */}
                {template.files && template.files.length > 0 && (
                    <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-element)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>📎 Reference Attachments</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                            The following reference documents are provided by the template. You can download them for guidance.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {template.files.map((file, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => downloadFile(file.fileName, file.originalName || file.name)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0.75rem',
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-bg-element)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        textAlign: 'left'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-bg-element)'}
                                >
                                    <FileText size={20} color="var(--color-primary)" style={{ marginRight: '0.75rem' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{file.originalName || file.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                            {Math.round(file.size / 1024)} KB
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 500 }}>
                                        Download
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Render Form Fields from Schema */}
                    {formData.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            {formData.map((field) => (
                                <div key={field.id} style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontWeight: 500 }}>
                                        {field.label} {field.required && <span style={{ color: 'var(--color-error)' }}>*</span>}
                                    </label>
                                    {renderFieldInput(field)}
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            Attachments
                        </label>
                        <FileUpload onFilesChange={setFiles} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--color-bg-element)' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/')} // Cancel to Dashboard
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text-muted)',
                                fontWeight: 600,
                                border: '1px solid var(--color-bg-element)'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 2rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'var(--color-success)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '1rem'
                            }}
                        >
                            <Send size={20} /> Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
