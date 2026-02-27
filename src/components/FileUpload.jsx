import React, { useCallback, useState } from 'react'
import { UploadCloud, File, X, Loader } from 'lucide-react'
import { useWorkflow } from '../context/WorkflowContext'

export default function FileUpload({ onFilesChange }) {
    const [isDragging, setIsDragging] = useState(false)
    const [files, setFiles] = useState([])
    const [uploading, setUploading] = useState(false)
    const { uploadFile } = useWorkflow()

    const handleDrag = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDragIn = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [])

    const handleDragOut = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback(async (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const droppedFiles = Array.from(e.dataTransfer.files)
        if (droppedFiles && droppedFiles.length > 0) {
            await uploadFiles(droppedFiles)
        }
    }, [files, onFilesChange])

    const handleFileInput = async (e) => {
        const selectedFiles = Array.from(e.target.files)
        if (selectedFiles && selectedFiles.length > 0) {
            await uploadFiles(selectedFiles)
        }
    }

    const uploadFiles = async (filesToUpload) => {
        setUploading(true)
        try {
            const uploadPromises = filesToUpload.map(file => uploadFile(file))
            const uploadedFiles = await Promise.all(uploadPromises)

            const newFiles = [...files, ...uploadedFiles]
            setFiles(newFiles)
            onFilesChange(newFiles)
        } catch (err) {
            console.error('Upload failed', err)
            alert('File upload failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
        onFilesChange(newFiles)
    }

    return (
        <div style={{ width: '100%' }}>
            <div
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                    border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-bg-element)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    marginBottom: '1rem'
                }}
                onClick={() => document.getElementById('file-input').click()}
            >
                <input
                    type="file"
                    id="file-input"
                    multiple
                    onChange={handleFileInput}
                    style={{ display: 'none' }}
                />
                <div style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    {uploading ? <Loader size={48} className="animate-spin" /> : <UploadCloud size={48} />}
                </div>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                    {uploading ? 'Uploading...' : 'Click or drag file to this area to upload'}
                </p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Support for a single or bulk upload. Strictly prohibit from uploading company data or other banned files.</p>
            </div>

            {files.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {files.map((file, index) => (
                        <div key={`${file.fileName || file.originalName}-${index}`} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem',
                            backgroundColor: 'var(--color-bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-bg-element)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <File size={20} color="var(--color-primary)" />
                                <span style={{ fontSize: '0.9rem' }}>{file.originalName}</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                    ({Math.round(file.size / 1024)} KB)
                                </span>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                style={{ color: 'var(--color-text-muted)', padding: '4px' }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
