# SmartSeason_Field_Monitorig_System
I have reviewed the technical assessment for the SmartSeason Field Monitoring System. Here is a clear breakdown of the project requirements, technical expectations, and submission details to help you get started.

## Project Overview
The objective is to build a web application that tracks crop progress across multiple fields during a growing season. The system must demonstrate your ability to design a clean system, implement business logic, and build a usable interface.

## Core Requirements

### Users & Access
* **Roles:** The system must support Admin (Coordinator) and Field Agent roles.
* **Security:** You need to implement authentication to ensure users only see information relevant to their role.

### Field Management & Tracking
* **Creation & Assignment:** Admins must be able to create and manage fields, as well as assign them to field agents.
* **Field Data:** Each field must track its Name, Crop type, Planting date, and Current stage[cite: 21, 22, 23, 24].
* **Updates:** Field Agents can update a field's stage and add notes or observations. Admins can view all fields to monitor these updates.
* **Lifecycle Stages:** Fields will progress through standard stages: Planted, Growing, Ready, and Harvested. 

### Business Logic & Dashboards
* **Computed Status:** You must implement logic to determine if a field is Active, At Risk, or Completed based on its data.
* **Dashboards:** Provide a dashboard summarizing total fields, status breakdowns, and useful insights. Admins see an overview of all fields, while Agents only see their assigned fields.

## Technical Expectations & Submission
* **Tech Stack:** You are free to choose your stack. A typical setup suggested includes a Node.js, Django, or Laravel backend; a React frontend; and a relational database like MySQL or PostgreSQL. 
* **Code Quality:** The focus should be on clean structure, working APIs, and clear separation of concerns.Do not over-engineer; prioritize simplicity and functionality.
* **Deliverables:** Submit a GitHub repository along with a README documenting setup instructions, design decisions, and assumptions.Demo credentials are required, and a live deployment link is optional.
* **Deadline:** The submission is due by 25/04/2026 via email with the repository link and access details.

# Database or API Design

 This design uses a standard relational model and RESTful API principles.

### 1. Database Schema
We'll keep the tables focused on the core entities: Users, Fields, and Notes. 

**`users` table**
Handles authentication and role management.
* `id` (Primary Key, UUID/Integer)
* `name` (String)
* `email` (String, Unique)
* `password_hash` (String)
* `role` (Enum: `ADMIN`, `AGENT`) 
* `created_at` (Timestamp)

**`fields` table**
Stores the core agricultural data and tracks assignments.
* `id` (Primary Key, UUID/Integer)
* `name` (String) 
* `crop_type` (String) 
* `planting_date` 
* `current_stage` (Enum: `PLANTED`, `GROWING`, `READY`, `HARVESTED`) 
* `status` (Enum: `ACTIVE`, `AT_RISK`, `COMPLETED`) 
* `assigned_agent_id` (Foreign Key referencing `users.id`, Nullable) 
* `created_at` (Timestamp)
* `updated_at` (Timestamp)

**`notes` table**
Allows agents to add updates or observations to specific fields.
* `id` (Primary Key, UUID/Integer)
* `field_id` (Foreign Key referencing `fields.id`)
* `author_id` (Foreign Key referencing `users.id`)
* `content` (Text)
* `created_at` (Timestamp)

---

### 2. API Endpoints
[cite_start]These endpoints are designed to be RESTful, with route protection ensuring users only access what is relevant to their role[cite: 14].

**Authentication**
* `POST /api/auth/login` - Authenticates a user and returns a token (e.g., JWT).

**Field Management**
* `GET /api/fields` 
    * *Admin:* Returns a list of all fields[cite: 31].
    * *Agent:* Returns a list of only their assigned fields.
* `POST /api/fields` - Creates a new field (Admin only).
* `GET /api/fields/:id` - Retrieves details for a specific field.
* `PUT /api/fields/:id` - Updates a field. Agents can use this to update the `current_stage`.
* `PATCH /api/fields/:id/assign` - Assigns a specific field to an Agent (Admin only).

**Notes & Observations**
* `GET /api/fields/:id/notes` - Retrieves all notes for a specific field.
* `POST /api/fields/:id/notes` - Adds a new note or observation to a field.

**Dashboard & Summaries**
* `GET /api/dashboard/summary` - Returns computed aggregate data (total fields, status breakdown). The backend should filter this based on the requesting user's role (all fields for Admins, assigned fields for Agents).

