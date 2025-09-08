
Christian Professionals Network (CPN) Platform

A full-stack web application for the Christian Professionals Network, featuring a modern React frontend, Node.js/Express backend, PostgreSQL, Redis, JWT authentication, real-time updates, and Cloudinary image uploads.


#Features

- User & Admin Authentication (JWT, secure sessions)
- Admin Dashboard: Analytics, blog, events, newsletter, enrollees, contact inquiries, and more
- Profile Management: Profile picture upload, update, and removal with - Cloudinary integration
- Events: Create, edit, and manage events with image uploads
- Blog: Rich markdown editor, image uploads, and post management
- Newsletter: Compose and send newsletters to subscribers
- Contact Inquiries: Manage and respond to user inquiries
- Enrollee Management: View, filter, and broadcast to course enrollees
- Real-time Updates: WebSocket-powered dashboard refresh
- Responsive UI: Tailwind CSS, mobile-friendly, modern design
- Dockerized: Easy local and production deployment


# Tech Stack
- Frontend: React, Redux Toolkit, React Router v6, Tailwind CSS,   Framer Motion, Sonner (toasts), FontAwesome
- Backend: Node.js, Express.js, PostgreSQL, Redis, JWT, bcryptjs, Nodemailer, Cloudinary, ws (WebSocket)
- DevOps: Docker, Docker Compose, GitHub Actions (CI/CD)
- Other: Markdown parsing, custom markdown editor, image upload with backend signing


#Monorepo Structure


CpnWebsiteProject/
  backend/         # Node.js/Express API, MongoDB, Redis, WebSocket, Cloudinary
  frontEnd/cpnui/  # React app, Tailwind, RTK Query, admin dashboard, public site
  Docker-compose.yml
  README.md


##Local Development


#Prerequisites
- Node.js 18+
- Docker & Docker Compose


#Environment Variables
- Copy .env.example to .env in both backend/ and frontEnd/cpnui/
- Set your secrets (DB, JWT, Cloudinary, email, etc.)


Start with Docker Compose

- Frontend: http://localhost
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5433
- Redis: localhost:6379


# Manual Start (for development)


# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontEnd/cpnui
npm install
npm run dev


# Running Tests & Lint
- Lint:
 cd frontEnd/cpnui
  npm run lint

- Backend Tests:
 cd backend
  npm test


# Deployment
- CI/CD:
GitHub Actions runs lint/tests and builds/pushes Docker images on main branch.
- Production:
Set all environment variables in your deployment environment or Docker secrets.


#Key Endpoints

- Auth: /api/auth/login, /api/auth/forgot-password, /api/auth/reset-password
- Admin Profile: /api/admin/profile (PATCH), /api/admin/upload-image (POST), /api/admin/profile-picture (DELETE)
- Blog: /api/admin/blog, /api/admin/blog/upload-image
- Events: /api/events, /api/admin/events
- Newsletter: /api/admin/newsletter
- Enrollees: /api/enrollments/admin/enrollments, /api/enrollments/admin/enrollments/broadcast
- Contact: /api/contact/submit


#Notable Features

- Profile Picture: Upload, update, and remove profile picture (reverts to initials avatar if removed)
- WebSocket: Real-time dashboard updates for admins
- Markdown Editor: Custom commands, image upload, table/underline commands removed for stability
- Error Handling: Defensive coding, toast notifications, auto-logout on token expiration
- Responsive Design: Sidebar, navbar, and dashboard are mobile-friendly and accessible


Key Endpoints

Auth: /api/auth/login, /api/auth/forgot-password, /api/auth/reset-password
Admin Profile: /api/admin/profile (PATCH), /api/admin/upload-image (POST), /api/admin/profile-picture (DELETE)
Blog: /api/admin/blog, /api/admin/blog/upload-image
Events: /api/events, /api/admin/events
Newsletter: /api/admin/newsletter
Enrollees: /api/enrollments/admin/enrollments, /api/enrollments/admin/enrollments/broadcast
Contact: /api/contact/submit


Notable Features

Profile Picture: Upload, update, and remove profile picture (reverts to initials avatar if removed)
WebSocket: Real-time dashboard updates for admins
Markdown Editor: Custom commands, image upload, table/underline commands removed for stability
Error Handling: Defensive coding, toast notifications, auto-logout on token expiration
Responsive Design: Sidebar, navbar, and dashboard are mobile-friendly and accessible


Contributing

1. Fork the repo
2. Create your feature branch (git checkout -b feature/YourFeature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin feature/YourFeature)
5. Open a pull request


License
MIT
