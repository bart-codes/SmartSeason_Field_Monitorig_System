# SmartSeason Field Monitoring System

## Overview
SmartSeason Field Monitoring System is a web-based farm monitoring application that is actively helping Admins and Field Agents track crop progress across multiple fields, manage assignments, and monitor field health with stage-based workflows and dashboard summaries. The system is being used to streamline agricultural operations in Kenya's Central and Rift Valley regions.

## Key Features

- ✅ Role-based access control is being enforced for Admin and Field Agent users
- ✅ Field creation, assignment, and lifecycle tracking are being managed through an intuitive dashboard
- ✅ Crop monitoring with stage updates and observation notes is being documented in real-time
- ✅ Computed status values (Active, At Risk, Completed) are being calculated automatically
- ✅ Dashboard summaries, status breakdowns, and field counts are being displayed dynamically
- ✅ Responsive interface and secure authentication flow are being maintained consistently

## User Roles

**Admin (Coordinator)**
- Creating, editing, and assigning fields across the farm
- Viewing all fields and associated notes from agents
- Monitoring field progression and status summaries in real-time
- Accessing dashboard insights for the full farm portfolio
- Managing agent profiles and credentials

**Field Agent**
- Viewing only their assigned fields in the field list
- Updating field stage as crops progress through growth cycles
- Adding observations and notes to track crop health
- Tracking crop progress through Planted, Growing, Ready, Harvested stages
- Viewing computed status and field details relevant to their assigned work

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
- `ACTIVE`: field is actively growing through mid-stage phases
- `AT_RISK`: field is experiencing delayed updates, missing observations, or abnormal duration in a stage
- `COMPLETED`: field is reaching `HARVESTED` status

**Dashboard expectations**
- Admins are seeing totals for all fields, status breakdowns, and agent assignment summaries
- Agents are seeing totals only for their assigned fields and their current workload

## API Design

The API is being implemented as a RESTful service with role-aware access control.

**Authentication**
- `POST /api/auth/login` — authenticating users and issuing JWT tokens

**Fields**
- `GET /api/fields` — listing fields; responses are being filtered by role
- `POST /api/fields` — creating new fields (Admin only)
- `GET /api/fields/:id` — retrieving field details
- `PUT /api/fields/:id` — updating field details; stage updates are being allowed for agents
- `PATCH /api/fields/:id/assign` — assigning a field to an agent (Admin only)

**Field Notes**
- `GET /api/fields/:id/notes` — retrieving field observations
- `POST /api/fields/:id/notes` — adding notes for the field

**Agent Management**
- `GET /api/agents` — listing all agents (Admin only)
- `POST /api/agents` — creating new agent accounts (Admin only)
- `PUT /api/agents/:id` — updating agent details (Admin only)
- `DELETE /api/agents/:id` — removing agents from the system (Admin only)

**Dashboard**
- `GET /api/dashboard/summary` — retrieving aggregated metrics and counts based on role

## Chosen Stack

This repository now uses the recommended stack:

- Backend: Node.js + Express
- Frontend: React + Vite
- Database: SQLite
- Authentication: JWT

## Project Layout

- `backend/` — Express API, SQLite database, authentication, field management routes
- `frontend/` — React app built with Vite for a fast development experience
- `.env.example` — example environment variables

## Setup Instructions

1. Clone the repository
2. Open a terminal in the project root

### Backend

```bash
cd backend
npm install
cp ../.env.example .env
npm start
```

### Frontend

```bash
cd ../frontend
npm install
npm run dev
```

3. Open the frontend URL shown by Vite, typically `http://localhost:5173`
4. Log in with the sample credentials

> Note: The backend runs on port `4000` and the frontend runs on port `5173`.

## Demo Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `Password123!`

**Agent Accounts (Central & Rift Valley Regions):**
- **Wanjiru Muthoni** (Kigumo Heights, Maize): `wanjiru@example.com` / `Agent123!`
- **Kipchoge Koech** (Nakuru Spring, Wheat): `kipchoge@example.com` / `Agent123!`
- **Njeri Kamau** (Murang'a River Bottom, Potatoes): `njeri@example.com` / `Agent123!`
- **Chemutai Kiplagat** (Eldoret Green Valley, Barley): `chemutai@example.com` / `Agent123!`

## Assumptions

- Authentication is being required for both Admin and Agent users
- Agents are only accessing fields explicitly assigned to them
- Field lifecycle is following fixed stages and status is being computed automatically
- Dashboard metrics are being filtered by user role to ensure data security
- The system is prioritizing a minimal viable product for core functionality
- Kenyan local names and regions are being used for all field and agent data

## Screenshots & System Flow

### 1. Login Page
Users are logging in with their email and password. The backend determines their role from their credentials.

### 2. Admin Dashboard
Admins are viewing the operations overview with metrics for all fields:
- Total fields count
- Active fields count
- At-risk fields alert
- Completed fields count

The field overview table displays all fields with columns: Field Name, Crop Type, Stage, Status (color-coded badges), Assigned Agent, and Planted Date.

### 3. Agent Dashboard
Agents are viewing a filtered view showing only their assigned fields and workload metrics relevant to their assignments.

### 4. Field Details Modal
Agents and Admins are opening field details by clicking a field row. The modal displays:
- Field information (name, crop type, stage, status)
- Edit button (visible only to agents viewing their fields and admins)
- Notes section showing all observations
- Add note functionality for real-time updates

### 5. Agent Management (Admin Only)
Admins are managing agent profiles by:
- Clicking the "Agents" navigation link
- Viewing all agents in a directory
- Clicking "+ Add Agent" button to create new agent accounts
- Editing agent name, email, and password
- Deleting agents from the system

### 6. Create New Field (Admin Only)
Admins are creating new fields by:
- Going to the Fields page
- Clicking "+ Add new field" button (visible only to admins)
- Filling in: Field Name, Crop Type, Planting Date, Current Stage
- Optionally assigning the field to an agent
- Clicking "Create Field" - the new field appears in the table

### 7. Edit Field
Agents and Admins are editing field details:
- Opening a field modal
- Clicking "Edit" button
- Updating stage, crop type, or planting date
- Clicking "Save Changes" to persist updates
- The field table refreshes automatically

## Visual Documentation

For detailed screenshots of each feature, view the [screenshots directory](./screenshots/) which includes:

- **Login Page** - Authentication interface
- **Admin Dashboard** - Operations overview with metrics and field table
- **Fields Page** - Field management with add field button
- **Add Field Modal** - Form for creating new fields
- **Agent Directory** - Agent management interface with add/edit/delete controls
- **Field Detail Modal** - Field information, edit capability, and notes section

Each screenshot is documented with feature descriptions and user role access levels.

