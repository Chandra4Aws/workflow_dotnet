-- Database Schema for Workflow Application (.NET 8.0)

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(120) NOT NULL
);

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    form_schema TEXT,
    creator_id BIGINT REFERENCES users(id),
    approver_group_id BIGINT REFERENCES groups(id),
    files TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    creator_id BIGINT REFERENCES users(id),
    approver_group_id BIGINT REFERENCES groups(id),
    template_id BIGINT REFERENCES templates(id),
    reviewer_statuses TEXT,
    form_data TEXT,
    timeline TEXT,
    files TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-Many: user_roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Many-to-Many: user_groups
CREATE TABLE IF NOT EXISTS user_groups (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    group_id BIGINT REFERENCES groups(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, group_id)
);

-- Many-to-Many: workflow_reviewers
CREATE TABLE IF NOT EXISTS workflow_reviewers (
    workflow_id BIGINT REFERENCES workflows(id) ON DELETE CASCADE,
    group_id BIGINT REFERENCES groups(id) ON DELETE CASCADE,
    PRIMARY KEY (workflow_id, group_id)
);

-- Many-to-Many: template_reviewers
CREATE TABLE IF NOT EXISTS template_reviewers (
    template_id BIGINT REFERENCES templates(id) ON DELETE CASCADE,
    group_id BIGINT REFERENCES groups(id) ON DELETE CASCADE,
    PRIMARY KEY (template_id, group_id)
);

-- Seed Data for Roles
INSERT INTO roles (name) VALUES ('ROLE_USER'), ('ROLE_MODERATOR'), ('ROLE_ADMIN') ON CONFLICT (name) DO NOTHING;
