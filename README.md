# SmartSeason Field Monitoring System

A comprehensive web-based farm monitoring application helping Admins and Field Agents track crop progress, manage field assignments, and monitor agricultural health across multiple fields.

## Overview

SmartSeason Field Monitoring System is actively helping agricultural operations in Kenya's Central and Rift Valley regions streamline their farming workflows. The system enables role-based access control, field lifecycle management, and real-time crop monitoring with automated status computation.

**Current Status**: 🟢 Production Ready
- **Backend**: Node.js + Express running on port 4000
- **Frontend**: React + Vite running on port 5173
- **Database**: SQLite for persistent data storage
- **Authentication**: JWT-based secure login system

## Key Features

- ✅ Role-based access control is being enforced for Admin and Field Agent users
- ✅ Field creation, assignment, and lifecycle tracking are being managed through an intuitive dashboard
- ✅ Crop monitoring with stage updates and observation notes is being documented in real-time
- ✅ Computed status values (Active, At Risk, Completed) are being calculated automatically
- ✅ Dashboard summaries, status breakdowns, and field counts are being displayed dynamically
- ✅ Responsive interface and secure authentication flow are being maintained consistently
- ✅ Agent management (create, edit, delete) for administrator coordination
- ✅ Real-time field status updates and progress tracking

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

### Visual Walkthrough

The SmartSeason system provides an intuitive user interface tailored to each user's role. Below is a comprehensive walkthrough of all key pages and features:

#### 1. **Login Page** - Authentication Entry Point
Users are logging in with their email and password. The backend determines their role from their credentials.
- Clean, minimalist interface with green agricultural theme
- Email and password input fields  
- "Sign In" button for authentication
- Used by: All users (Admin and Agents)

#### 2. **Admin Dashboard** - Operations Overview
Admins are viewing the operations overview with metrics for all fields:
- Total fields count
- Active fields count
- At-risk fields alert
- Completed fields count
- Field Overview table displaying all fields with columns: Field Name, Crop Type, Stage, Status (color-coded badges), Assigned Agent, and Planted Date
- Screenshot: `admin dashboard.png`

#### 3. **Agent Dashboard** - Filtered View
Agents are viewing a filtered dashboard showing only their assigned fields and workload metrics:
- Metrics filtered to agent's assigned fields only
- Quick overview of their assigned fields
- Navigation to manage their specific work
- Screenshot: `agent dashboard.png`

#### 4. **Fields Management Page** - Admin Field Operations
Admins are managing all fields through an intuitive interface:
- "Field Management" header with description
- "+ Add new field" button (green, admin-only visibility)
- Field list table with columns: Name, Crop, Planting, Stage, Agent, Status
- Shows all 4 field records: Kigumo Heights, Nakuru Spring, Murang'a River Bottom, Eldoret Green Valley
- Agents see the same table but without the "Add new field" button
- Screenshot: `admin fields.png`

#### 5. **Add New Field Modal** - Field Creation Form (Admin Only)
Admins are creating new fields through a structured modal form:
- "Add New Field" heading
- Form fields:
  - Field Name (required text input)
  - Crop Type (required text input, e.g., Corn, Soybean, Wheat)
  - Planting Date (required date picker)
  - Current Stage (dropdown: Planted, Growing, Ready, Harvested)
  - Assign Agent (dropdown with optional agent selection)
- "Create Field" button (with loading state) and "Cancel" button
- Form validation prevents submission with empty required fields
- Note: This feature is admin-only and not visible to agents

#### 6. **Agent Directory** - Agent Management Interface (Admin Only)
Admins are managing agent profiles with full CRUD capabilities:
- "Agent directory" heading with description
- "+ Add Agent" button (green, admin-only)
- Agent cards displaying:
  - Agent name (Chemutai Kiplagat, Kipchoge Koech, Njeri Kamau, Wanjiru Muthoni)
  - Email address (chemutai@example.com, kipchoge@example.com, etc.)
  - Role badge (AGENT)
  - Edit and Delete action buttons on each card
- Inline edit/delete controls for each agent
- Screenshots: `admin agents management.png`, `admin add new agent.png`, `admin edit agent.png`, `admin delete agent.png`

#### 7. **Field Detail Modal** - Field Information & Updates
Agents and Admins are opening field details by clicking a field row:
- Field name (e.g., Kigumo Heights) with close button (×)
- "Edit" button (blue, conditional visibility)
- Field information displayed:
  - Crop type: Maize
  - Planting date: 2026-03-12
  - Current stage: GROWING
  - Status: ACTIVE (color-coded badge)
  - Assigned agent: Wanjiru Muthoni
- "Recent notes" section showing all observations
- Add note functionality with textbox and "Add note" button for real-time updates
- Edit capability with "Save Changes" button
- Field table refreshes automatically after updates
- Screenshot: `agent field editing.png`

### User Interface Styling & Theme

- **Primary Color**: #3d6e4e (Agricultural Green) - used for buttons and primary elements
- **Fonts**: 
  - Crimson Pro (serif, headings and display text)
  - DM Sans (sans-serif, body text and UI elements)
- **Status Badge Colors**:
  - ACTIVE = Green (#5a7d67)
  - AT_RISK = Red (#c73e1d)
  - COMPLETED = Primary (#3d6e4e)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Layout**: Card-based design with subtle shadows and professional borders

## User Role Access & Permissions

### Admin Features (Full System Access)

Admins have complete access to all system features:

✅ **Dashboard**: View operations overview with all field metrics
✅ **Fields Management**: 
  - View all fields across entire operation
  - Create new fields with crop type, stage, and agent assignment
  - Edit field details (name, crop type, stage, planting date)
  - See the "+ Add new field" button on Fields page
✅ **Agent Management**:
  - View all agents in Agent Directory
  - Create new agent accounts with email and password
  - Edit agent name, email, and credentials
  - Delete agents from the system (with confirmation)
  - See the "+ Add Agent" button
✅ **Notes**: View and add notes to any field

### Agent Features (Limited to Assigned Fields)

Agents have restricted access based on their assigned fields:

✅ **Dashboard**: View filtered view showing only their assigned fields
✅ **Fields Management**:
  - View ONLY their assigned fields in the field list
  - Edit their assigned field details (stage, crop type, planting date)
  - Click field rows to view detailed information
❌ Cannot see "+ Add new field" button
❌ Cannot create, edit, or delete other agents' fields

✅ **Notes**: Add observation notes to their assigned fields

✅ **View Only**: See field status, assigned agent, and crop progress

### Permission Matrix

| Feature | Admin | Agent |
|---------|-------|-------|
| View Dashboard | ✅ All Fields | ✅ Assigned Only |
| View All Fields | ✅ Yes | ❌ No |
| Create Fields | ✅ Yes | ❌ No |
| Edit Fields | ✅ All | ✅ Assigned Only |
| Delete Fields | ✅ Yes | ❌ No |
| Add Notes | ✅ Yes | ✅ Yes |
| View Notes | ✅ All | ✅ Assigned Only |
| Manage Agents | ✅ Yes | ❌ No |
| View Agents List | ✅ Yes | ❌ No |

## System Workflow

The system follows this logical flow for all user interactions:

1. **User Login** (Public)
   - Email/Password authentication
   - Backend determines role from credentials
   - JWT token issued for authenticated session

2. **Dashboard** (Role-Filtered)
   - Admins: See operations overview with ALL field metrics
   - Agents: See filtered view with ONLY their assigned fields

3. **Field Management** (Role-Restricted)
   - **Admin Flow**:
     - Browse all fields
     - Click "+ Add new field" to create fields
     - Click field row to view/edit details
     - Assign fields to agents
   - **Agent Flow**:
     - Browse only assigned fields
     - Cannot create fields
     - Click field row to view and edit details
     - Add observations/notes

4. **Agent Management** (Admin Only)
   - View all agents in directory
   - Click "+ Add Agent" to create new accounts
   - Edit agent details inline
   - Delete agents with confirmation

5. **Field Details Modal** (Role-Aware)
   - Display field information
   - Show "Edit" button based on permissions
   - Display recent notes section
   - Allow adding new notes
   - Auto-refresh field list after changes

## Data & Location Context

### Regions Served

- **Central Region**: Nyeri, Murang'a districts
  - Fields: Kigumo Heights (Maize), Murang'a River Bottom (Potatoes)
  - Agents: Wanjiru Muthoni, Njeri Kamau

- **Rift Valley Region**: Nakuru, Uasin Gishu counties
  - Fields: Nakuru Spring (Wheat), Eldoret Green Valley (Barley)
  - Agents: Kipchoge Koech, Chemutai Kiplagat

### Crop Types Monitored

- **Maize** - Primary staple crop
- **Wheat** - Rift Valley specialty crop
- **Potatoes** - High-value crop in Central region
- **Barley** - Alternative crop option

### Field Lifecycle Stages

- **PLANTED**: Initial planting phase completed
- **GROWING**: Active growth and development phase
- **READY**: Crop ready for harvest (monitoring for optimal timing)
- **HARVESTED**: Harvest completed, cycle finished

### Status Computation

- **ACTIVE**: Field is in active growing phases (PLANTED or GROWING)
- **AT_RISK**: Experiencing delays, missing updates, or extended duration in a stage
- **COMPLETED**: Field has reached HARVESTED stage

## Assumptions

- Authentication is being required for both Admin and Agent users
- Agents are only accessing fields explicitly assigned to them
- Field lifecycle is following fixed stages and status is being computed automatically
- Dashboard metrics are being filtered by user role to ensure data security
- The system is prioritizing a minimal viable product for core functionality
- Kenyan local names and regions are being used for all field and agent data

## Screenshot Reference Guide

For visual reference of all features, the following screenshots are available in the `screenshots/` directory:

- `admin dashboard.png` - Admin operations overview
- `admin fields.png` - Fields management with add button
- `admin agents management.png` - Agent directory view
- `admin add new agent.png` - Creating new agent accounts
- `admin edit agent.png` - Editing agent details
- `admin delete agent.png` - Agent deletion interface
- `agent dashboard.png` - Agent filtered dashboard view
- `agent field editing.png` - Field detail modal and editing interface

