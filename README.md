# SmartSeason Field Monitoring System

## Overview
SmartSeason Field Monitoring System is a proposal for a web-based farm monitoring application. The system is designed to help Admins and Field Agents track crop progress across multiple fields, manage assignments, and monitor field health with stage-based workflows and dashboard summaries.

## Key Features

- Role-based access control for Admin and Field Agent users
- Field creation, assignment, and lifecycle tracking
- Crop monitoring with stage updates and observation notes
- Computed status values: Active, At Risk, Completed
- Dashboard summaries, status breakdowns, and field counts
- Responsive interface and secure authentication flow

## User Roles

**Admin (Coordinator)**
- Create, edit, and assign fields
- View all fields and associated notes
- Monitor field progression and status summaries
- Access dashboard insights for the full farm portfolio

**Field Agent**
- View assigned fields only
- Update field stage and add observations
- Track crop progress through Planted, Growing, Ready, Harvested
- See computed status and field details relevant to assigned work

## Domain Model

The system centers on three main entities:

**Users**
- `id`, `name`, `email`, `password_hash`, `role`, `created_at`
- Roles: `ADMIN`, `AGENT`

**Fields**
- `id`, `name`, `crop_type`, `planting_date`, `current_stage`, `status`, `assigned_agent_id`, `created_at`, `updated_at`
- Stages: `PLANTED`, `GROWING`, `READY`, `HARVESTED`
- Status values: `ACTIVE`, `AT_RISK`, `COMPLETED`

**Notes**
- `id`, `field_id`, `author_id`, `content`, `created_at`
- Field agents can leave observations tied to a field record

## Business Logic

**Field Status Computation**
- `ACTIVE`: field is still in an active growth stage
- `AT_RISK`: field has a delayed update, missing observations, or an abnormal duration in a stage
- `COMPLETED`: field has reached `HARVESTED`

**Dashboard expectations**
- Admins see totals for all fields, status breakdowns, and agent assignment summaries
- Agents see totals only for their assigned fields and their current workload

## API Design

The API should be RESTful and role-aware.

**Authentication**
- `POST /api/auth/login` — authenticate users and issue a token.

**Fields**
- `GET /api/fields` — list fields; response filtered by role
- `POST /api/fields` — create a new field (Admin only)
- `GET /api/fields/:id` — get field details
- `PUT /api/fields/:id` — update field details; stage updates may be allowed for agents
- `PATCH /api/fields/:id/assign` — assign a field to an agent (Admin only)

**Field Notes**
- `GET /api/fields/:id/notes` — retrieve field observations
- `POST /api/fields/:id/notes` — add a note for the field

**Dashboard**
- `GET /api/dashboard/summary` — return aggregated metrics and counts based on role

## Suggested Architecture

A clean implementation could use:

- Backend: Node.js + Express, Django, or Laravel
- Frontend: React, Vue, or plain HTML/CSS/JS
- Database: PostgreSQL or MySQL
- Authentication: JWT or session-based auth

## Setup Instructions

1. Clone the repository
2. Install backend dependencies
3. Configure database credentials
4. Run database migrations
5. Start backend and frontend servers
6. Open the application in the browser

## Demo Credentials

- Admin: `admin@example.com` / `Password123!`
- Agent: `agent@example.com` / `Agent123!`

## Assumptions

- Authentication is required for both Admin and Agent
- Agents only access fields explicitly assigned to them
- Field lifecycle follows fixed stages and status is computed automatically
- Dashboard metrics are filtered by user role
- Minimal viable product is prioritized over extra features

## Submission Notes

This README documents the project intent, data model, API design, and implementation plan for the SmartSeason Field Monitoring System. The final repository should include code, setup scripts, and deployment or run instructions.

