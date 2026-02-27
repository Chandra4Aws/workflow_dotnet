
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWorkflow } from '../context/WorkflowContext'
import FileUpload from '../components/FileUpload'
import { ArrowLeft, Save, Trash2, Type, Hash, Calendar, List, CheckSquare as CheckIcon, Plus } from 'lucide-react'

export default function WorkflowBuilder() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { user } = useAuth()
    const { publishTemplate, updateTemplate, groups, templates } = useWorkflow()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [files, setFiles] = useState([])
    const [formFields, setFormFields] = useState([])
    const [reviewerGroupIds, setReviewerGroupIds] = useState([])
    const [approverGroupId, setApproverGroupId] = useState('')

    // Load template data if editing
    React.useEffect(() => {
        if (id && templates.length > 0) {
            const template = templates.find(t => t.id == id)
            if (template) {
                setTitle(template.title)
                setDescription(template.description)
                setFormFields(template.formSchema || [])
                setFiles(template.files || [])
                if (template.reviewerGroups?.length > 0) {
                    setReviewerGroupIds(template.reviewerGroups.map(g => g.id.toString()))
                } else {
                    setReviewerGroupIds([])
                }
                setApproverGroupId(template.approver?.id || '')
            }
        }
    }, [id, templates])

    // Groups are all available for selection
    // No specific filtering needed unless we want to filter by name?
    // Assuming all groups can be reviewers/approvers

    const addField = (type) => {
        setFormFields([...formFields, {
            id: crypto.randomUUID(),
            type,
            label: '',
            // value removed, as we are defining the schema
            options: type === 'select' ? 'Option 1, Option 2' : '',
            required: false
        }])
    }

    const removeField = (id) => {
        setFormFields(formFields.filter(f => f.id !== id))
    }

    const updateField = (id, key, val) => {
        setFormFields(formFields.map(f => f.id === id ? { ...f, [key]: val } : f))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Files are already uploaded and contain server metadata
        // Publish as a template, not an active workflow
        const templateData = {
            title,
            description,
            files: files, // Already contains server metadata from upload
            formSchema: formFields,
            reviewerGroupIds,
            approverGroupId
        }

        if (id) {
            updateTemplate(id, templateData)
        } else {
            publishTemplate(templateData, user)
        }
        navigate('/workflows/templates')
    }

    const renderFieldInput = (field) => {
        // Only show configuration inputs (options), not value inputs
        const inputStyle = {
            width: '100%',
            padding: '0.5rem',
            backgroundColor: 'var(--color-bg-primary)',
            border: '1px solid var(--color-bg-element)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-main)',
            marginTop: '0.25rem'
        }

        if (field.type === 'select') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={field.options}
                        onChange={(e) => updateField(field.id, 'options', e.target.value)}
                        placeholder="Options (comma separated)"
                        style={{ ...inputStyle, fontSize: '0.85rem', fontStyle: 'italic' }}
                    />
                </div>
            )
        }
        return null // No "value" input for other types in builder mode
    }

    const getIcon = (type) => {
        switch (type) {
            case 'text': return <Type size={16} />
            case 'number': return <Hash size={16} />
            case 'date': return <Calendar size={16} />
            case 'select': return <List size={16} />
            case 'checkbox': return <CheckIcon size={16} />
            default: return <Type size={16} />
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
                <ArrowLeft size={20} /> Back
            </button>

            <div style={{
                backgroundColor: 'var(--color-bg-secondary)',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-bg-element)'
            }}>
                <h1 style={{ marginBottom: '0.5rem' }}>{id ? 'Edit Template' : 'Design New Workflow'}</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    {id ? 'Update the existing workflow template.' : 'Design a new workflow template. Define the form fields users need to fill out.'}
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            Workflow Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Q3 Marketing Budget Review"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: 'var(--color-bg-primary)',
                                border: '1px solid var(--color-bg-element)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text-main)',
                                fontSize: '1rem'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            Description
                        </label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the purpose of this workflow..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: 'var(--color-bg-primary)',
                                border: '1px solid var(--color-bg-element)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text-main)',
                                fontSize: '1rem',
                                fontFamily: 'inherit',
                                resize: 'vertical'
                            }}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                Assign Reviewer Group(s)
                            </label>
                            <select
                                multiple
                                value={reviewerGroupIds}
                                onChange={(e) => {
                                    const options = [...e.target.selectedOptions];
                                    setReviewerGroupIds(options.map(option => option.value));
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    border: '1px solid var(--color-bg-element)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-text-main)',
                                    fontSize: '1rem',
                                    minHeight: '120px'
                                }}
                                required
                            >
                                {groups.map(g => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
                            <small style={{ color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>Hold Ctrl/Cmd to select multiple</small>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                Assign Approver Group
                            </label>
                            <select
                                value={approverGroupId}
                                onChange={(e) => setApproverGroupId(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    border: '1px solid var(--color-bg-element)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-text-main)',
                                    fontSize: '1rem'
                                }}
                                required
                            >
                                <option value="">Select a Group...</option>
                                {groups.map(g => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Form Builder Section */}
                    <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-bg-element)' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Form Designer</h3>

                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            {['text', 'number', 'date', 'select', 'checkbox'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => addField(type)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid var(--color-bg-element)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--color-text-muted)',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <Plus size={14} /> {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {formFields.map((field) => (
                                <div key={field.id} style={{
                                    display: 'flex', gap: '1rem', padding: '1rem',
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-bg-element)',
                                    borderRadius: 'var(--radius-md)',
                                    alignItems: 'flex-start'
                                }}>
                                    <div style={{ marginTop: '0.5rem', color: 'var(--color-primary)' }}>
                                        {getIcon(field.type)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="text"
                                            value={field.label}
                                            onChange={(e) => updateField(field.id, 'label', e.target.value)}
                                            placeholder="Field Label (e.g. Budget Amount)"
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem',
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                borderBottom: '1px solid var(--color-bg-element)',
                                                color: 'var(--color-text-main)',
                                                fontWeight: 600,
                                                outline: 'none',
                                                marginBottom: '0.5rem'
                                            }}
                                        />
                                        {renderFieldInput(field)}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeField(field.id)}
                                        style={{ color: 'var(--color-error)', opacity: 0.7, padding: '0.25rem' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {formFields.length === 0 && (
                                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                    No custom fields added. Click buttons above to add fields to your template.
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            Template Attachments (Reference Docs)
                        </label>
                        <FileUpload onFilesChange={setFiles} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text-muted)',
                                fontWeight: 600
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!title || !description}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                fontWeight: 600,
                                opacity: (!title || !description) ? 0.5 : 1,
                                cursor: (!title || !description) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <Save size={20} /> {id ? 'Update Template' : 'Publish Template'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
