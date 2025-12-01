START OF README (PLAIN TEXT)

Job Application Tracker — Backend API

This backend provides all API functionality for the Job Application Tracker project, including user authentication, job posting, and application management. It is built using Node.js, Express, and MongoDB.

Project Structure
server/
index.js
config/
db.js
middleware/
auth.middleware.js
role.middleware.js
models/
User.js
Job.js
Application.js
routes/
auth.routes.js
jobs.routes.js
applications.routes.js
Technologies Used

Node.js
Express.js
MongoDB Atlas
Mongoose
JSON Web Tokens (JWT)
Bcrypt.js
CORS

Installation and Setup:

1. Navigate to the server folder and install dependencies:
   npm install
2. Create a .env file inside the server directory:
   PORT=5000
   MONGO_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-secret-key
3. Start the backend server:
   npm start

Expected server output:
Server running on port 5000
MongoDB connected successfully

API Documentation

1. Authentication Routes
   Register
   POST /api/auth/register
   Body:
   name
   email
   password
   role (optional, default: user)

Login
POST /api/auth/login
Body:
email
password

Both routes return a JWT token that must be included in protected requests.

2. Job Routes (Admin Only for Create, Update, Delete)

All admin routes require the header:
Authorization: Bearer <token>

Create Job (Admin)
POST /api/jobs
Body:
title
company
location
description

Get All Jobs (Public)
GET /api/jobs

Update Job (Admin)
PUT /api/jobs/:id

Delete Job (Admin)
DELETE /api/jobs/:id

3. Application Routes

All application routes require the header:
Authorization: Bearer <token>

Apply to a Job (User)
POST /api/applications/:jobId
Body:
notes (optional)

Get My Applications (User)
GET /api/applications/my

Get All Applications (Admin)
GET /api/applications

Update Application Status (Admin)
PUT /api/applications/:id/status
Body:
status

Valid status values:
pending
reviewed
accepted
rejected

Roles and Permissions
User:
Apply to jobs
View personal application history

Admin:
Create jobs
Edit jobs
Delete jobs
View all job applications
Update application status

Database Models Overview
User Model Fields:
name
email
password
role

Job Model Fields:
title
company
location
description
createdAt
Application Model Fields:

user (reference to User)
job (reference to Job)
status
notes
createdAt

Testing the API
Use Postman, Thunder Client, or curl.
Typical test sequence:

1. Register a user
2. Log in
3. Copy the returned token
4. Add the header to protected routes:
   Authorization: Bearer <token>

Deployment
This backend can be deployed using:
Render
Railway
Vercel (Serverless API Endpoints)
Heroku (if available)

Deployment instructions can be added later if needed.
