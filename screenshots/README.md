# SmartSeason System Screenshots

This directory contains screenshots of the SmartSeason Field Monitoring System demonstrating all key features and workflows.

## Screenshots Included

### 1. **01-login-page.jpg**
- **Description**: Login page showing email and password fields
- **Features**:
  - Clean, minimalist login interface
  - Green agricultural theme
  - Email and password input fields
  - "Sign In" button
- **Used by**: All users (Admin and Agents)

### 2. **02-admin-dashboard.jpg**
- **Description**: Admin Operations Overview dashboard
- **Features**:
  - Operations Overview with 4 metric cards:
    - Total fields: 4
    - Active fields: 2
    - At risk: 1
    - Completed: 1
  - "Field Overview" table showing all fields
- **Used by**: Admin only
- **Shows**: System metrics and field overview

### 3. **03-fields-page-with-add-button.jpg**
- **Description**: Fields management page for administrators
- **Features**:
  - "Field Management" header
  - "+ Add new field" button (green, admin-only)
  - Field list table with 4 fields
  - Columns: Name, Crop, Planting, Stage, Agent, Status
- **Used by**: Admins see the "Add new field" button; Agents see the table only
- **Allows**: Admins to create new fields

### 4. **04-add-field-modal.jpg**
- **Description**: Modal form for creating new fields
- **Features**:
  - "Add New Field" heading
  - Form fields:
    - Field Name (required)
    - Crop Type (required)
    - Planting Date (required, date picker)
    - Current Stage (dropdown)
    - Assign Agent (dropdown, optional)
  - "Create Field" and "Cancel" buttons
  - Form validation
- **Used by**: Admins only
- **Allows**: Creation of new field records with optional agent assignment

### 5. **05-agent-directory.jpg**
- **Description**: Agent management directory for administrators
- **Features**:
  - "Agent directory" heading
  - "+ Add Agent" button (green, admin-only)
  - Agent cards displaying:
    - Agent name (Chemutai Kiplagat, Kipchoge Koech, Njeri Kamau, Wanjiru Muthoni)
    - Email address
    - Role badge (AGENT)
    - Edit and Delete action buttons
- **Used by**: Admins only
- **Allows**: Viewing, creating, editing, and deleting agent accounts

### 6. **06-field-detail-modal.jpg**
- **Description**: Field details modal when clicking on a field
- **Features**:
  - Field name (Kigumo Heights) with close button
  - "Edit" button (blue) for making changes
  - Field information:
    - Crop type: Maize
    - Planting date: 2026-03-12
    - Current stage: GROWING
    - Status: ACTIVE
    - Assigned agent: Wanjiru Muthoni
  - "Recent notes" section
  - Add note functionality
- **Used by**: Both Admins and Agents (Agents can edit their assigned fields)
- **Allows**: Viewing field details and adding observation notes

## User Role Access

### Admin Features (All pages + actions)
✅ View Dashboard with full metrics
✅ View all Fields
✅ Create new Fields (+ Add new field button visible)
✅ Edit Field details
✅ View Agent Directory
✅ Create new Agents (+ Add Agent button visible)
✅ Edit Agent details
✅ Delete Agents

### Agent Features (Limited to assigned fields)
✅ View Dashboard (filtered to their fields only)
✅ View only their assigned Fields
✅ Edit their assigned Field details (stage, crop type, etc.)
✅ Add notes to their assigned Fields
❌ Cannot see "Add new field" button
❌ Cannot create or manage agents
❌ Cannot delete fields

## System Flow

1. **User Login**: Email/Password authentication
   - Backend determines role from credentials
   
2. **Dashboard**: View overview metrics and field status
   - Admins: See all fields across entire operation
   - Agents: See only their assigned fields
   
3. **Field Management**:
   - Admins: Create, assign, and edit all fields
   - Agents: Edit stage and add notes to assigned fields
   
4. **Agent Management** (Admin only):
   - Add new agent accounts
   - Edit agent credentials
   - Delete agents from system
   
5. **Field Details**: Click any field row to view/edit details and notes

## Styling & Theme

- **Primary Color**: #3d6e4e (Agricultural Green)
- **Font**: Crimson Pro (headings), DM Sans (body)
- **Status Badges**: Color-coded (ACTIVE=green, AT_RISK=red, COMPLETED=primary)
- **Responsive Design**: Works on desktop, tablet, and mobile
