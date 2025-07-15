# CPN Website Project

A comprehensive website for Christian Professionals Network with blog functionality, admin dashboard, and newsletter system.

## Features

- **Frontend**: React with Vite, Tailwind CSS
- **Backend**: Node.js with Express, PostgreSQL
- **Blog System**: Create, read, and manage blog posts
- **Admin Dashboard**: Manage blog posts, subscribers, and contact inquiries
- **Newsletter System**: Send newsletters to subscribers
- **Contact Form**: Submit inquiries and subscribe to newsletter
- **Responsive Design**: Fully responsive across all devices

## Project Structure

```
CpnWebsiteProject/
├── frontEnd/cpnui/          # React frontend
├── backend/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   └── server.js           # Main server file
└── cpnchatbotproj/         # Rasa chatbot (separate)
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd CpnWebsiteProject/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory with:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=cpn_db
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

4. **Set up PostgreSQL database:**
   - Create a database named `cpn_db`
   - Run the schema file:
   ```bash
   psql -U postgres -d cpn_db -f config/schema.sql
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd CpnWebsiteProject/frontEnd/cpnui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Blog
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:slug` - Get single blog post

### Contact
- `POST /api/contact/submit` - Submit contact form
- `POST /api/contact/subscribe` - Subscribe to newsletter

### Admin (Protected)
- `POST /api/admin/blog` - Create blog post
- `GET /api/admin/inquiries` - Get contact inquiries
- `PUT /api/admin/inquiries/:id` - Respond to inquiry
- `GET /api/admin/subscribers` - Get all subscribers
- `POST /api/admin/newsletter` - Send newsletter

### Subscribers
- `GET /api/subscribers` - Get all subscribers
- `DELETE /api/subscribers/:email` - Unsubscribe

## Default Admin Credentials

- **Username**: admin
- **Password**: password
- **Email**: admin@cpn.com

## Blog Posts

The system comes with two sample blog posts:
1. "How to be a Good Leader" - Leadership tips and guidance
2. "Biblical Principles for Professional Excellence" - Faith-based professional development

## Admin Dashboard

Access the admin dashboard at `/admin` to:
- Create and manage blog posts
- View and respond to contact inquiries
- Manage newsletter subscribers
- Send newsletters to all subscribers

## Features

### Blog System
- Responsive blog listing page
- Individual blog post pages with full content
- Admin can create new posts instantly
- SEO-friendly URLs with slugs

### Contact System
- Contact form with validation
- Newsletter subscription
- Admin can view and respond to inquiries
- Email notifications (configure in .env)

### Newsletter System
- Subscriber management
- Bulk email sending
- HTML email support
- Unsubscribe functionality

### Security
- JWT authentication for admin routes
- Password hashing with bcrypt
- Protected admin endpoints
- Input validation and sanitization

## Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontEnd/cpnui
npm run dev  # Start Vite development server
```

## Production Deployment

1. **Backend:**
   - Set up environment variables for production
   - Use PM2 or similar for process management
   - Configure reverse proxy (nginx)

2. **Frontend:**
   - Build the project: `npm run build`
   - Serve static files from a web server
   - Configure API base URL for production

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in .env
- Verify database exists and schema is loaded

### Email Issues
- Configure Gmail app password for EMAIL_PASS
- Enable 2FA on Gmail account
- Check email service configuration

### Frontend API Issues
- Ensure backend server is running on port 5000
- Check CORS configuration
- Verify API endpoints are correct

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 