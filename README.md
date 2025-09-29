# Home Tuition Website

A comprehensive home tuition management system built with React frontend, Node.js/Express backend, and MongoDB database. This platform connects students with qualified teachers for personalized home-based education.

## 🚀 Features

### For Students
- **Personalized Dashboard**: Track test results, fee payments, and teacher assignments
- **Teacher Profiles**: View assigned teachers with contact information
- **Fee Management**: Monitor fee structure and pending payments
- **Performance Tracking**: View test scores and academic progress

### For Teachers
- **Student Management**: View assigned students and their details
- **Salary Tracking**: Monitor monthly salary and payment history
- **Profile Management**: Update qualifications and availability
- **Performance Analytics**: Track teaching performance and ratings

### General Features
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Authentication System**: Secure login for students, teachers, and admins
- **Price Calculator**: Calculate tuition fees based on class and subjects
- **Tutor Search**: Find teachers by location and subject
- **CBSE Curriculum**: Support for classes 1-12 with all CBSE subjects
- **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Smooth animations
- **React Icons** - Icon library
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Express Validator** - Input validation

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd home-tuition-website
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/home-tuition
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
PORT=5000
```

### 4. Database Setup

Make sure MongoDB is running on your system:
```bash
# Start MongoDB service
mongod
```

### 5. Run the Application

#### Option 1: Run both frontend and backend together
```bash
# From the root directory
npm run start:all
```

#### Option 2: Run separately
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
home-tuition-website/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   └── App.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── index.js           # Server entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students/profile/:userId` - Get student profile
- `PUT /api/students/profile/:userId` - Update student profile
- `POST /api/students/test-marks/:userId` - Add test marks
- `GET /api/students/test-marks/:userId` - Get test marks
- `PUT /api/students/fee-structure/:userId` - Update fee structure
- `GET /api/students/pending-fees/:userId` - Get pending fees

### Teachers
- `GET /api/teachers/profile/:userId` - Get teacher profile
- `PUT /api/teachers/profile/:userId` - Update teacher profile
- `GET /api/teachers/students/:userId` - Get teacher's students
- `POST /api/teachers/add-student/:userId` - Add student to teacher
- `GET /api/teachers/salary/:userId` - Get salary details
- `PUT /api/teachers/salary/:userId` - Update salary structure

### Subjects & Pricing
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/class/:class` - Get subjects by class
- `GET /api/pricing` - Get pricing information
- `POST /api/pricing/calculate` - Calculate pricing

### Tutors
- `GET /api/tutors/search` - Search tutors by location
- `GET /api/tutors/:tutorId` - Get tutor details
- `GET /api/tutors/subjects/available` - Get available subjects

## 🎨 Key Features Explained

### 1. Home Page
- Hero section with compelling banner
- Feature highlights with icons
- Statistics showcase
- Call-to-action buttons
- Teacher hiring section

### 2. Pricing Calculator
- Class selection (1-12)
- Subject selection based on CBSE curriculum
- Real-time price calculation
- Discount application
- Find tutor functionality by location

### 3. Student Dashboard
- Overview with quick stats
- Test results tracking
- Teacher assignments
- Fee management
- Performance analytics

### 4. Teacher Dashboard
- Student management
- Salary tracking
- Profile management
- Performance metrics
- Payment history

## 🚀 Deploying to Render (both frontend + backend)

You can deploy this repository to Render in two ways:

1) Single Web Service (recommended for simplicity): Build the React app during Render's build, and serve the static files from Express.
2) Two services (more scalable): Deploy the frontend as a Static Site and the backend as a Web Service.

Below are step-by-step instructions for the single-web-service approach (fastest):

### Single Web Service (build & serve)

1. In the root of this repository we've added a `postinstall` script that builds the client during the Render build step. This means the server will serve `client/build` when `NODE_ENV=production`.

2. Files changed / important scripts:
- `package.json` (root): contains `postinstall` to build client and `start:render` to run the server in production.
- `server/index.js`: serves static `client/build` when NODE_ENV=production.

3. Create a new Web Service on Render:
	- Connect your GitHub repository.
	- Build Command: npm install
	- Start Command: npm run start:render
	- Environment: set `NODE_ENV=production` and set `MONGODB_URI` (use MongoDB Atlas connection string) and `JWT_SECRET`.

4. Add Environment Variables on Render (in the service settings):
	- MONGODB_URI (required) e.g. mongodb+srv://user:pass@cluster.mongodb.net/dbname
	- JWT_SECRET (required) a long secret string
	- PORT (optional) default 5000

5. Deploy. Render will run `npm install`, which triggers `postinstall` -> builds the React app into `client/build`. The server will then run with `NODE_ENV=production` and serve the build.

### Two-Service approach (preferred for production)

1. Frontend (Static Site on Render):
	- Create a Static Site -> Connect repo -> Root Directory: `client`
	- Build Command: `npm install && npm run build`
	- Publish Directory: `client/build`

2. Backend (Web Service on Render):
	- Create a Web Service -> Connect repo -> Root Directory: `/`
	- Build Command: `cd server && npm install`
	- Start Command: `cd server && npm run start` (or `npm run dev` for development)
	- Environment variables: `MONGODB_URI`, `JWT_SECRET`, `PORT`

3. Set the frontend to point to the backend API URL (Render provides a service URL). In `client/package.json`, remove or override the `proxy` in development. For production builds, the client should call full API URLs or use a runtime config variable. A simple approach is to set an environment variable at build time and replace API base URL.

### Notes & recommended changes for hosting on Render
- Ensure `server/.env` is NOT checked into source. Use Render's environment variables.
- The root `postinstall` will install client dependencies and build the React app which slightly increases build time but makes single-service deployment easy.
- If you prefer separate services (best practice), deploy the frontend as a Static Site and backend as Web Service and use the backend URL in client API requests.

### Quick checklist before deploy
- Commit and push the repository to GitHub.
- Make sure `server/scripts/initData.js` (seed) is not run automatically in production. Run it manually if you need seeded data.
- Configure your MongoDB Atlas network access (allow Render's IPs or use 0.0.0.0/0 during testing).
- Add `JWT_SECRET` and `MONGODB_URI` in Render's Environment settings.

If you want, I can:
- Add a small runtime config to inject REACT_APP_API_URL during build so the client talks to the deployed backend URL.
- Provide exact Render dashboard screenshots and field values for each step (if you want a guided walkthrough).


### 5. Authentication
- Role-based access (Student/Teacher/Admin)
- Secure JWT authentication
- Form validation
- Password hashing

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Environment variable protection

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the `client/build` folder

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Deploy the `server` folder
3. Configure MongoDB Atlas for production

### Database
- Use MongoDB Atlas for production
- Update `MONGODB_URI` in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: support@hometuition.com
- Phone: +91 6205165191, +91 8252241135

## 🎯 Future Enhancements

- Video call integration for online classes
- Assignment submission system
- Parent portal
- Mobile app development
- Advanced analytics dashboard
- Payment gateway integration
- Notification system
- File upload for documents

---

**Built with ❤️ for quality education**

