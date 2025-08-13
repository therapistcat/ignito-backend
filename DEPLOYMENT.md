# 🚀 Deployment Guide - Render.com

This guide provides step-by-step instructions for deploying the Bookstore Management System to Render.com, a modern cloud platform that offers free hosting for student projects.

**Author:** University Student (Jivanshu)  
**Platform:** Render.com  
**Database:** MongoDB Atlas (Cloud)  
**Deployment Type:** Full-Stack (Backend + Frontend)

## 🎯 Deployment Overview

We'll deploy two separate services on Render:
1. **Backend API** - Node.js/Express server
2. **Frontend App** - React application built with Vite

Both will connect to your existing MongoDB Atlas database in the cloud.

## 📋 Prerequisites

Before starting deployment, ensure you have:

- ✅ **GitHub Account** - [Sign up here](https://github.com/)
- ✅ **Render Account** - [Sign up here](https://render.com/)
- ✅ **Working Local Application** - Backend and frontend running locally
- ✅ **MongoDB Atlas Database** - With your data populated
- ✅ **Git Repository** - Your code pushed to GitHub

## 🔧 Pre-Deployment Preparation

### 1. Prepare Your Repository

#### Push Code to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Bookstore Management System"

# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/bookstore-management-system.git

# Push to GitHub
git push -u origin main
```

#### Verify .gitignore
Make sure your `.gitignore` includes:
```
# Environment variables
.env
.env.local
.env.production

# Dependencies
node_modules/
bookstore-frontend/node_modules/

# Build outputs
bookstore-frontend/dist/
bookstore-frontend/build/

# Logs
*.log
npm-debug.log*
```

### 2. Prepare Backend for Production

#### Update package.json Scripts
Ensure your `package.json` has the correct start script:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

#### Create Production Environment Configuration
Update your `src/config/database.js` to handle production:
```javascript
// Production-ready database configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore_db';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`🍃 MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};
```

### 3. Prepare Frontend for Production

#### Update API Base URL
Create `bookstore-frontend/src/config/api.js`:
```javascript
// API configuration for different environments
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-app.onrender.com/api'  // Will update this after backend deployment
  : 'http://localhost:3000/api';

export default API_BASE_URL;
```

Update `bookstore-frontend/src/services/api.js`:
```javascript
import API_BASE_URL from '../config/api';

// Use the environment-specific base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
```

## 🌐 Backend Deployment (Step 1)

### 1. Create Backend Service on Render

1. **Go to Render Dashboard**: [https://dashboard.render.com/](https://dashboard.render.com/)
2. **Click "New +"** → **"Web Service"**
3. **Connect GitHub Repository**:
   - Click "Connect account" if not connected
   - Select your repository
   - Click "Connect"

### 2. Configure Backend Service

#### Basic Settings
- **Name**: `bookstore-backend` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your location
- **Branch**: `main`
- **Root Directory**: Leave empty (since backend is in root)

#### Build & Deploy Settings
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### Advanced Settings
- **Auto-Deploy**: Yes (recommended)
- **Health Check Path**: `/api/books` (optional)

### 3. Environment Variables

Click **"Environment"** tab and add these variables:

| Key | Value | Description |
|-----|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://chulbuleMishraJi:Jivanshu@chulbulemishraji.8mcwh5g.mongodb.net/bookstore_db?retryWrites=true&w=majority&appName=chulbuleMishraJi` | Your MongoDB Atlas connection string |
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Port (Render uses 10000 by default) |

**Important**: Use your actual MongoDB Atlas connection string!

### 4. Deploy Backend

1. **Click "Create Web Service"**
2. **Wait for deployment** (usually 2-5 minutes)
3. **Check deployment logs** for any errors
4. **Test your backend** at the provided URL (e.g., `https://bookstore-backend-xyz.onrender.com`)

#### Verify Backend Deployment
Test these endpoints:
- `https://your-backend-url.onrender.com/api/books`
- `https://your-backend-url.onrender.com/api/authors`
- `https://your-backend-url.onrender.com/api/orders`

## 🎨 Frontend Deployment (Step 2)

### 1. Update Frontend Configuration

#### Update API Base URL
In `bookstore-frontend/src/config/api.js`, replace with your actual backend URL:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://bookstore-backend-xyz.onrender.com/api'  // Your actual backend URL
  : 'http://localhost:3000/api';
```

#### Commit and Push Changes
```bash
git add .
git commit -m "Update API URL for production deployment"
git push origin main
```

### 2. Create Frontend Service on Render

1. **Go to Render Dashboard**
2. **Click "New +"** → **"Static Site"**
3. **Connect Same GitHub Repository**

### 3. Configure Frontend Service

#### Basic Settings
- **Name**: `bookstore-frontend` (or your preferred name)
- **Branch**: `main`
- **Root Directory**: `bookstore-frontend`

#### Build Settings
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

#### Advanced Settings
- **Auto-Deploy**: Yes
- **Pull Request Previews**: Yes (optional)

### 4. Deploy Frontend

1. **Click "Create Static Site"**
2. **Wait for deployment** (usually 3-7 minutes)
3. **Check deployment logs** for any errors
4. **Test your frontend** at the provided URL

## ✅ Post-Deployment Verification

### 1. Test Complete Application

#### Backend Testing
```bash
# Test API endpoints (replace with your actual URL)
curl https://your-backend-url.onrender.com/api/books
curl https://your-backend-url.onrender.com/api/authors
curl https://your-backend-url.onrender.com/api/orders
```

#### Frontend Testing
1. **Visit your frontend URL**
2. **Test navigation** between pages
3. **Test search functionality**
4. **Try creating/editing books, authors, orders**
5. **Verify data persistence** (refresh page, data should remain)

### 2. Performance Optimization

#### Backend Optimizations
- **Enable compression** in Express:
```javascript
const compression = require('compression');
app.use(compression());
```

- **Add request logging** for monitoring:
```javascript
const morgan = require('morgan');
app.use(morgan('combined'));
```

#### Frontend Optimizations
- **Build optimization** is handled by Vite automatically
- **Static assets** are served efficiently by Render
- **Caching** is enabled by default

## 🔧 Common Deployment Issues & Solutions

### Backend Issues

#### Issue: "Application failed to start"
**Solution:**
1. Check build logs in Render dashboard
2. Verify `package.json` start script
3. Ensure all dependencies are in `dependencies` (not `devDependencies`)

#### Issue: "Database connection failed"
**Solution:**
1. Verify MongoDB Atlas connection string in environment variables
2. Check MongoDB Atlas Network Access (whitelist 0.0.0.0/0 for Render)
3. Confirm database user credentials

#### Issue: "Port binding error"
**Solution:**
```javascript
// Use Render's PORT environment variable
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### Frontend Issues

#### Issue: "Build failed"
**Solution:**
1. Check if all dependencies are installed
2. Verify build command: `npm install && npm run build`
3. Ensure `dist` folder is created during build

#### Issue: "API calls failing"
**Solution:**
1. Verify backend URL in frontend configuration
2. Check CORS settings in backend
3. Ensure backend is deployed and running

#### Issue: "Routing not working"
**Solution:**
Add `_redirects` file in `public` folder:
```
/*    /index.html   200
```

## 🔒 Security Considerations

### Environment Variables
- ✅ **Never commit** `.env` files to Git
- ✅ **Use Render's environment variables** for sensitive data
- ✅ **Rotate MongoDB passwords** periodically

### Database Security
- ✅ **Whitelist specific IPs** in MongoDB Atlas (or 0.0.0.0/0 for development)
- ✅ **Use strong passwords** for database users
- ✅ **Enable database monitoring** in MongoDB Atlas

### API Security
- ✅ **Enable CORS** with specific origins in production
- ✅ **Add rate limiting** to prevent abuse
- ✅ **Validate all inputs** on the server side

## 📊 Monitoring & Maintenance

### Render Dashboard
- **Monitor deployment logs**
- **Check service health**
- **View usage metrics**
- **Set up alerts** for downtime

### MongoDB Atlas
- **Monitor database performance**
- **Check connection logs**
- **Set up backup schedules**
- **Monitor storage usage**

## 🎓 Learning Outcomes

By completing this deployment, you've learned:

- **Cloud deployment** with modern platforms
- **Environment configuration** for production
- **Database management** in the cloud
- **Full-stack application** deployment
- **DevOps basics** and CI/CD concepts
- **Production troubleshooting** skills

## 📞 Support & Resources

### Render Documentation
- **Render Docs**: [https://render.com/docs](https://render.com/docs)
- **Node.js Deployment**: [https://render.com/docs/deploy-node-express-app](https://render.com/docs/deploy-node-express-app)
- **Static Site Deployment**: [https://render.com/docs/deploy-create-react-app](https://render.com/docs/deploy-create-react-app)

### MongoDB Atlas
- **Atlas Documentation**: [https://docs.atlas.mongodb.com/](https://docs.atlas.mongodb.com/)
- **Connection Troubleshooting**: [https://docs.atlas.mongodb.com/troubleshoot-connection/](https://docs.atlas.mongodb.com/troubleshoot-connection/)

---

**Deployment Status**: 🚀 Ready for Production  
**Platform**: Render.com  
**Database**: MongoDB Atlas  
**Author**: Jivanshu (University Student)
