
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const WorkflowContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkflow() {
    return useContext(WorkflowContext)
}

const INITIAL_USERS = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Creator', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Reviewer', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Approver', status: 'Active' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Creator', status: 'Inactive' },
]

const INITIAL_WORKFLOWS = [
    {
        id: '1',
        title: 'Q3 Marketing Budget Review',
        description: 'Review of the proposed budget allocation for Q3 marketing campaigns.',
        status: 'Pending Review',
        creator: 'John Doe',
        submittedDate: new Date().toISOString(),
        files: [{ name: 'Budget_Sheet_v1.xlsx', size: '15kb' }],
        timeline: [
            { id: 1, action: 'Workflow Created', user: 'John Doe', role: 'Creator', date: new Date().toLocaleString() }
        ]
    }
]

const INITIAL_TEMPLATES = [
    {
        id: 'tpl_001',
        title: 'Paid Time Off (PTO) Request',
        description: 'Submit this form to request vacation, sick leave, or personal time off. Approval required from manager.',
        creator: 'Admin',
        createdDate: new Date().toISOString(),
        formSchema: [
            { id: 1, type: 'date', label: 'Start Date', required: true, value: '' },
            { id: 2, type: 'date', label: 'End Date', required: true, value: '' },
            { id: 3, type: 'select', label: 'Leave Type', options: 'Vacation, Sick, Personal, Jury Duty', required: true, value: 'Vacation' },
            { id: 4, type: 'text', label: 'Reason (Optional)', required: false, value: '' }
        ]
    },
    {
        id: 'tpl_002',
        title: 'IT Equipment Request',
        description: 'Request new hardware or software. Please check the approved equipment list before submitting.',
        creator: 'IT Dept',
        createdDate: new Date().toISOString(),
        formSchema: [
            { id: 1, type: 'select', label: 'Equipment Type', options: 'Laptop, Monitor, Keyboard/Mouse, Headset, Software License', required: true, value: 'Laptop' },
            { id: 2, type: 'text', label: 'Justification', required: true, value: '' },
            { id: 3, type: 'number', label: 'Estimated Cost ($)', required: false, value: '' },
            { id: 4, type: 'checkbox', label: 'Manager Pre-approval?', required: false, value: 'false' }
        ]
    }
]

export function WorkflowProvider({ children }) {
    const { user, logout } = useAuth()
    const [users, setUsers] = useState([])
    const [workflows, setWorkflows] = useState([])
    const [templates, setTemplates] = useState([])
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(false)

    const API_BASE_URL = 'http://localhost:5052/api'
    const getHeaders = () => {
        const storedUser = localStorage.getItem('workflow_user')
        const token = storedUser ? JSON.parse(storedUser).token : ''
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    }

    const handleResponse = async (res) => {
        const contentType = res.headers.get("content-type");
        let data = null;
        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await res.json();
        }

        if (!res.ok) {
            const errorMsg = data?.message || `API Error: ${res.status} ${res.statusText}`;
            throw new Error(errorMsg);
        }
        return data;
    }

    useEffect(() => {
        if (user) {
            fetchWorkflows()
            fetchTemplates()
            if (user.role === 'Admin') {
                fetchUsers()
                fetchGroups() // Fetch groups for Admin
            }
        }
    }, [user])

    const fetchWorkflows = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/workflows`, { headers: getHeaders() })
            const data = await handleResponse(res)
            const parsedData = data.map(wf => ({
                ...wf,
                submittedDate: wf.createdAt,
                creator: typeof wf.creator === 'object' ? wf.creator?.username : wf.creator,
                reviewers: wf.reviewerGroups || [],
                approver: wf.approverGroup || wf.approver,
                status: wf.status === 'PENDING' ? 'Pending Review' : wf.status,
                formData: typeof wf.formData === 'string' ? JSON.parse(wf.formData) : wf.formData,
                timeline: typeof wf.timeline === 'string' ? JSON.parse(wf.timeline) : (wf.timeline || []),
                files: typeof wf.files === 'string' ? JSON.parse(wf.files) : (wf.files || []),
                reviewerStatuses: typeof wf.reviewerStatuses === 'string' ? JSON.parse(wf.reviewerStatuses) : (wf.reviewerStatuses || {})
            }))
            setWorkflows(parsedData)
        } catch (err) {
            console.error('Failed to fetch workflows', err)
        }
    }

    const fetchTemplates = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/templates`, { headers: getHeaders() })
            const data = await handleResponse(res)
            // Backend sends formSchema as a JSON string, frontend expects an object/array
            const parsedData = data.map(tpl => ({
                ...tpl,
                reviewers: tpl.reviewerGroups || [],
                approver: tpl.approverGroup,
                formSchema: typeof tpl.formSchema === 'string' ? JSON.parse(tpl.formSchema) : tpl.formSchema,
                files: typeof tpl.files === 'string' ? JSON.parse(tpl.files) : (tpl.files || [])
            }))
            setTemplates(parsedData)
        } catch (err) {
            console.error('Failed to fetch templates', err)
        }
    }

    // User Actions
    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/users`, { headers: getHeaders() })
            const data = await handleResponse(res)
            // Map backend roles to frontend role names
            const mappedUsers = data.map(u => {
                const rolesList = u.roles || [];
                const roleStrings = rolesList.map(r => (typeof r === 'object' ? r.name : r));

                let roleName = 'ROLE_CREATOR';
                if (roleStrings.includes('ROLE_ADMIN')) roleName = 'ROLE_ADMIN';
                else if (roleStrings.includes('ROLE_APPROVER')) roleName = 'ROLE_APPROVER';
                else if (roleStrings.includes('ROLE_REVIEWER')) roleName = 'ROLE_REVIEWER';
                else if (roleStrings.length > 0) roleName = roleStrings[0];

                const rawRoleName = (roleName || 'ROLE_CREATOR').toString();
                const role = rawRoleName.replace('ROLE_', '').toLowerCase().charAt(0).toUpperCase() +
                    rawRoleName.replace('ROLE_', '').toLowerCase().slice(1);

                return {
                    ...u,
                    name: u.username,
                    role: role,
                    status: 'Active'
                }
            })
            console.log('Fetched and mapped users:', mappedUsers);
            setUsers(mappedUsers)
        } catch (err) {
            console.error('Failed to fetch users', err)
        }
    }

    const addUser = async (userData) => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    username: userData.name,
                    email: userData.email,
                    password: userData.password,
                    role: [userData.role.toLowerCase()],
                    groupIds: userData.groupIds || []
                })
            })
            await handleResponse(res)
            fetchUsers()
        } catch (err) {
            console.error('Failed to add user', err)
            throw err
        }
    }

    const deleteUser = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            })
            await handleResponse(res)
            fetchUsers()
        } catch (err) {
            console.error('Failed to delete user', err)
        }
    }

    const updateUserRole = async (id, newRole) => {
        try {
            const res = await fetch(`${API_BASE_URL}/users/${id}/role`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ role: newRole })
            })
            await handleResponse(res)
            fetchUsers()
        } catch (err) {
            console.error('Failed to update user role', err)
        }
    }

    const updateUser = async (id, userData) => {
        try {
            const res = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(userData)
            })
            const updatedUser = await handleResponse(res)
            fetchUsers()
            return updatedUser
        } catch (err) {
            console.error('Failed to update user', err)
            throw err
        }
    }

    // Group Management
    const fetchGroups = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/groups`, {
                headers: getHeaders()
            })
            const data = await handleResponse(res)
            setGroups(data)
        } catch (err) {
            console.error('Failed to fetch groups', err)
        }
    }

    const createGroup = async (groupData) => {
        try {
            const res = await fetch(`${API_BASE_URL}/groups`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(groupData)
            })
            await handleResponse(res)
            fetchGroups()
        } catch (err) {
            console.error('Failed to create group', err)
            throw err
        }
    }

    const updateGroup = async (id, groupData) => {
        try {
            const res = await fetch(`${API_BASE_URL}/groups/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(groupData)
            })
            await handleResponse(res)
            fetchGroups()
        } catch (err) {
            console.error('Failed to update group', err)
            throw err
        }
    }

    const deleteGroup = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/groups/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            })
            await handleResponse(res)
            fetchGroups()
        } catch (err) {
            console.error('Failed to delete group', err)
            throw err
        }
    }

    const updateUserGroups = async (userId, groupIds) => {
        try {
            const res = await fetch(`${API_BASE_URL}/users/${userId}/groups`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ groupIds })
            })
            const updatedUser = await handleResponse(res)
            fetchUsers()
            return updatedUser
        } catch (err) {
            console.error('Failed to update user groups', err)
            throw err
        }
    }

    // Template Actions
    const deleteTemplate = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/templates/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            })
            await handleResponse(res)
            fetchTemplates()
        } catch (err) {
            console.error('Failed to delete template', err)
            throw err
        }
    }

    const publishTemplate = async (templateData) => {
        try {
            const res = await fetch(`${API_BASE_URL}/templates`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    title: templateData.title,
                    description: templateData.description,
                    creatorId: user?.id,
                    formSchema: JSON.stringify(templateData.formSchema),
                    files: JSON.stringify(templateData.files || []),
                    reviewerGroupIds: (templateData.reviewerGroupIds || []).map(id => parseInt(id)),
                    approverGroupId: templateData.approverGroupId ? parseInt(templateData.approverGroupId) : null
                })
            })
            await handleResponse(res)
            fetchTemplates()
        } catch (err) {
            console.error('Failed to publish template', err)
        }
    }

    const updateTemplate = async (id, templateData) => {
        try {
            const res = await fetch(`${API_BASE_URL}/templates/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({
                    title: templateData.title,
                    description: templateData.description,
                    creatorId: user?.id,
                    formSchema: JSON.stringify(templateData.formSchema),
                    files: JSON.stringify(templateData.files || []),
                    reviewerGroupIds: (templateData.reviewerGroupIds || []).map(id => parseInt(id)),
                    approverGroupId: templateData.approverGroupId ? parseInt(templateData.approverGroupId) : null
                })
            })
            await handleResponse(res)
            fetchTemplates()
        } catch (err) {
            console.error('Failed to update template', err)
            throw err
        }
    }

    const uploadFile = async (file) => {
        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch(`${API_BASE_URL}/files/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': user ? `Bearer ${user.token}` : ''
                },
                body: formData
            })
            return await handleResponse(res)
        } catch (err) {
            console.error('File upload failed', err)
            throw err
        }
    }

    // Workflow Actions
    const addWorkflow = async (workflowData, actor) => {
        try {
            const payload = {
                ...workflowData,
                templateId: workflowData.templateId,
                status: 'Pending Review',
                formData: JSON.stringify(workflowData.formData || []),
                files: JSON.stringify(workflowData.files || []),
                reviewerStatuses: '{}',
                timeline: JSON.stringify([
                    {
                        id: Date.now(),
                        action: 'Workflow Created',
                        user: actor.name,
                        role: actor.role,
                        date: new Date().toLocaleString()
                    }
                ])
            }

            const targetHeaders = getHeaders()

            const res = await fetch(`${API_BASE_URL}/workflows`, {
                method: 'POST',
                headers: targetHeaders,
                body: JSON.stringify(payload)
            })
            await handleResponse(res)
            fetchWorkflows()
        } catch (err) {
            console.error('Failed to add workflow', err)
        }
    }

    const updateWorkflowStatus = async (id, newStatus, actor, actionName, extraData = {}) => {
        try {
            const workflow = workflows.find(w => w.id == id)
            if (!workflow) return

            const newTimeline = [
                ...workflow.timeline,
                {
                    id: Date.now(),
                    action: actionName,
                    user: actor.name,
                    role: actor.role,
                    date: new Date().toLocaleString()
                }
            ]

            const res = await fetch(`${API_BASE_URL}/workflows/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({
                    ...workflow,
                    ...extraData,
                    status: newStatus,
                    formData: typeof workflow.formData === 'string' ? workflow.formData : JSON.stringify(workflow.formData),
                    files: typeof workflow.files === 'string' ? workflow.files : JSON.stringify(workflow.files),
                    timeline: typeof newTimeline === 'string' ? newTimeline : JSON.stringify(newTimeline),
                    reviewerStatuses: typeof (extraData.reviewerStatuses || workflow.reviewerStatuses) === 'string'
                        ? (extraData.reviewerStatuses || workflow.reviewerStatuses)
                        : JSON.stringify(extraData.reviewerStatuses || workflow.reviewerStatuses)
                })
            })
            await handleResponse(res)
            fetchWorkflows()
        } catch (err) {
            console.error('Failed to update workflow status', err)
        }
    }

    const downloadFile = async (fileName, originalName) => {
        try {
            const res = await fetch(`${API_BASE_URL}/files/${fileName}`, {
                headers: {
                    'Authorization': user ? `Bearer ${user.token}` : ''
                }
            })
            if (!res.ok) throw new Error('Download failed')

            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = originalName || fileName
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (err) {
            console.error('Download failed', err)
            throw err
        }
    }

    const value = {
        users,
        addUser,
        deleteUser,
        updateUserRole,
        updateUser,
        workflows,
        addWorkflow,
        updateWorkflowStatus,
        templates,
        publishTemplate,
        updateTemplate,
        deleteTemplate,
        uploadFile,
        downloadFile,
        groups,
        fetchGroups,
        createGroup,
        updateGroup,
        deleteGroup,
        updateUserGroups
    }

    return (
        <WorkflowContext.Provider value={value}>
            {children}
        </WorkflowContext.Provider>
    )
}
