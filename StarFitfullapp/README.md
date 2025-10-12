# ⭐ StarFit - Gym Management Platform

A secure, full-stack gym management application with role-based authentication, client management, and analytics dashboard.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Security](https://img.shields.io/badge/security-production--ready-green)
![License](https://img.shields.io/badge/license-MIT-orange)

## 🚀 Features

### For Managers
- 📊 **Analytics Dashboard** - Revenue tracking, member growth, attendance patterns
- 👥 **Client Management** - View and manage all gym members
- 🔗 **Client Assignment** - Connect managers with their personal training clients
- 💪 **Workout Planning** - Create custom routines for clients
- 📈 **Performance Metrics** - Track occupancy rates, churn, and revenue

### For Users
- 🏋️ **Workout Tracking** - Log exercises, sets, and reps
- 📅 **Routine Management** - Follow personalized workout plans
- 👤 **Profile Management** - Track membership and payment status
- 📊 **Progress Tracking** - Monitor fitness journey

### Security Features
- 🔒 **Bcrypt Password Hashing** - Military-grade password encryption
- 🎫 **JWT Authentication** - Secure token-based access
- 🛡️ **Rate Limiting** - Protection against brute force attacks
- ✅ **Input Validation** - SQL injection and XSS protection
- 🔐 **Role-Based Access Control** - Separate permissions for managers and users
- 🌐 **CORS Protection** - Restricted cross-origin requests

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **SQLite3** - Lightweight database
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting

## 📋 Prerequisites

- Node.js 16+ and npm
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/starfit.git
cd StarFitfullapp
```

### 2. Backend Setup
```bash
cd auth-backend
npm install

# Create database and seed with demo data
node migrate.js
node seed.js

# Start backend server (port 3001)
node server.js
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd starfit-vite
npm install

# Start frontend dev server (port 5173)
npm run dev
```

### 4. Access the Application
- **Landing Page:** http://localhost:5173/
- **Login:** http://localhost:5173/login
- **User Registration:** http://localhost:5173/register
- **Manager Registration:** http://localhost:5173/register/manager

## 🔑 Demo Accounts

**⚠️ For Development Only - Remove before production!**

### Manager Account
- Email: `manager@starfit.com`
- Password: `Manager@123`

### User Accounts
- Email: `user@starfit.com` | Password: `User@123`
- Email: `ana@starfit.com` | Password: `Ana@123`
- Email: `bruno@starfit.com` | Password: `Bruno@123`
- Email: `carla@starfit.com` | Password: `Carla@123`

## 📁 Project Structure

```
StarFitfullapp/
├── auth-backend/              # Backend server
│   ├── .env                   # Environment variables (create from .env.example)
│   ├── .env.example          # Environment template
│   ├── server.js             # Express server with JWT auth
│   ├── migrate.js            # Database schema migration
│   ├── seed.js               # Demo data seeding
│   └── package.json          # Backend dependencies
│
├── starfit-vite/             # Frontend application
│   ├── src/
│   │   ├── App.js            # Main app with routing
│   │   ├── api.js            # API client with JWT handling
│   │   ├── LandingPage.js    # Professional landing page
│   │   ├── LoginPage.js      # Secure login form
│   │   ├── RegisterPage.js   # User registration
│   │   ├── ManagerRegisterPage.js  # Manager registration
│   │   ├── ManagerDashboard.js     # Manager dashboard
│   │   └── UserDashboard.js        # User dashboard
│   └── package.json          # Frontend dependencies
│
└── SECURITY_AND_FEATURES.md  # Detailed security documentation
```

## 🔒 Security Configuration

### Environment Variables
Create `auth-backend/.env` from `.env.example`:

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=24h
DB_PATH=./users.db
CORS_ORIGIN=http://localhost:5173
```

**🚨 Important:** Change `JWT_SECRET` to a strong random value for production!

## 🔐 API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | User authentication |
| POST | `/register` | User registration |
| POST | `/register/manager` | Manager registration |

### Protected Endpoints (Require JWT)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | List all users | Manager |
| GET | `/manager/clients` | Get manager's clients | Manager |
| POST | `/users/:userId/assign-manager` | Assign client to manager | Manager |
| GET | `/stats` | Dashboard statistics | Manager |
| GET | `/exercises` | List exercises | All |
| GET | `/routines/:user_id` | Get user routines | Owner/Manager |
| POST | `/routines` | Create routine | Owner/Manager |
| PUT | `/routines/:id/complete` | Mark routine complete | Owner/Manager |
| DELETE | `/routines/:id` | Delete routine | Owner/Manager |

## 🧪 Testing

### Test Authentication
```bash
# Login (get JWT token)
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@starfit.com","password":"Manager@123"}'

# Use token for protected routes
curl http://localhost:3001/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Rate Limiting
Try logging in more than 5 times with wrong credentials to trigger rate limit.

## 🚀 Deployment

### Production Checklist
- [ ] Change `JWT_SECRET` to a cryptographically secure random string
- [ ] Set `NODE_ENV=production`
- [ ] Remove all demo accounts from database
- [ ] Enable HTTPS
- [ ] Update `CORS_ORIGIN` to production domain
- [ ] Use production database (PostgreSQL/MySQL)
- [ ] Set up monitoring and logging
- [ ] Configure proper backup strategy
- [ ] Add email verification for new accounts
- [ ] Implement password reset flow

### Deployment Options
- **Heroku** - Easy deployment with PostgreSQL addon
- **Vercel** - Perfect for frontend (requires separate backend hosting)
- **DigitalOcean** - Full control with droplets
- **AWS** - Enterprise-grade scalability

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 3001 is already in use
netstat -ano | findstr :3001

# Install dependencies again
cd auth-backend
rm -rf node_modules
npm install
```

### Frontend can't connect to backend
- Ensure backend is running on http://localhost:3001
- Check CORS configuration in `auth-backend/.env`
- Verify API_BASE_URL in `starfit-vite/src/api.js`

### Database errors
```bash
# Reset database
cd auth-backend
rm users.db
node migrate.js
node seed.js
```

## 📖 Documentation

- [Security Implementation Details](./SECURITY_AND_FEATURES.md)
- [API Documentation](#-api-endpoints)
- [Database Schema](#-database-schema)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community
- Tailwind CSS for beautiful styling
- All contributors and testers

## 📞 Support

For issues and questions:
- Open an [Issue](https://github.com/yourusername/starfit/issues)
- Email: support@starfit.example
- Discord: [Join our server](https://discord.gg/starfit)

## 🗺️ Roadmap

### Version 2.1 (Planned)
- [ ] Email verification for new accounts
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Facebook)
- [ ] Mobile app (React Native)

### Version 3.0 (Future)
- [ ] Real-time notifications
- [ ] Video workout library
- [ ] Nutrition tracking
- [ ] Payment integration (Stripe)
- [ ] Multi-gym support

---

**Built with ❤️ by the StarFit Team**

⭐ Star this repo if you find it helpful!
