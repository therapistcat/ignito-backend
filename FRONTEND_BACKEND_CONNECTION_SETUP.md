# Frontend-Backend Connection Configuration

This document outlines the changes made to connect the deployed frontend and backend applications.

## 🌐 Application URLs
- **Frontend**: https://bookstore-management-xz4a.onrender.com
- **Backend**: https://ignito-backend.onrender.com

## 📝 Changes Made

### 1. Frontend Configuration Updates

#### Created API Configuration (`bookstore-frontend/src/config/api.js`)
- Environment-specific API base URLs
- Production: `https://ignito-backend.onrender.com/api`
- Development: `http://localhost:3000/api`
- Configurable timeouts and environment detection

#### Updated API Service (`bookstore-frontend/src/services/api.js`)
- Imports configuration from the new config file
- Uses environment-specific settings
- Enhanced logging for debugging

#### Updated Vite Configuration (`bookstore-frontend/vite.config.js`)
- Optimized build configuration
- Code splitting for better performance
- Preview server configuration

#### Created Environment Example (`.env.example`)
- Template for environment variables
- API configuration options
- App metadata

### 2. Backend Configuration Updates

#### Enhanced CORS Configuration (`server.js`)
- Specific origin allowlist including:
  - `http://localhost:3001` (development frontend)
  - `https://bookstore-management-xz4a.onrender.com` (production frontend)
  - `http://localhost:3000` (same origin)
- Credentials support enabled
- Enhanced logging for CORS debugging

### 3. Testing Infrastructure

#### Connection Test Script (`test-frontend-backend-connection.js`)
- Automated testing of backend health
- CORS configuration verification
- API endpoint connectivity tests
- Comprehensive reporting

## 🚀 Deployment Steps

### Backend Deployment
1. **Commit and push the updated backend code** with the new CORS configuration
2. **Redeploy the backend** on Render to apply the CORS changes
3. **Verify deployment** using the health endpoint: `https://ignito-backend.onrender.com/health`

### Frontend Deployment
1. **Build the frontend** with the new configuration:
   ```bash
   cd bookstore-frontend
   npm run build
   ```
2. **Deploy the built files** to your frontend hosting service
3. **Verify the deployment** by accessing: `https://bookstore-management-xz4a.onrender.com`

## ✅ Verification Checklist

### Backend Verification
- [ ] Backend health endpoint responds: `https://ignito-backend.onrender.com/health`
- [ ] API endpoints accessible: `https://ignito-backend.onrender.com/api/books`
- [ ] CORS headers include the frontend domain
- [ ] Environment shows "production"

### Frontend Verification
- [ ] Frontend loads without errors
- [ ] Browser console shows correct API base URL
- [ ] API calls succeed (check Network tab)
- [ ] Data loads properly in the application

### Connection Testing
- [ ] Run the connection test script: `node test-frontend-backend-connection.js`
- [ ] All tests should pass
- [ ] No CORS errors in browser console

## 🔧 Configuration Details

### Environment Detection
The frontend automatically detects the environment:
- **Production**: `import.meta.env.PROD === true`
- **Development**: `import.meta.env.PROD === false`

### API Timeouts
- **Production**: 15 seconds (longer for potential network latency)
- **Development**: 10 seconds

### CORS Policy
The backend allows requests from:
- Development frontend (`localhost:3001`)
- Production frontend (`bookstore-management-xz4a.onrender.com`)
- Same origin requests

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend is deployed with updated CORS configuration
   - Check browser console for specific error messages
   - Verify frontend domain is in the allowlist

2. **API Connection Failures**
   - Verify backend is running and accessible
   - Check network connectivity
   - Ensure API base URL is correct for the environment

3. **Build Issues**
   - Clear node_modules and reinstall dependencies
   - Check for any TypeScript or linting errors
   - Verify all imports are correct

### Debug Commands

```bash
# Test backend connectivity
curl https://ignito-backend.onrender.com/health

# Test API endpoint
curl https://ignito-backend.onrender.com/api/books

# Run connection tests
node test-frontend-backend-connection.js

# Build frontend
cd bookstore-frontend && npm run build
```

## 📊 Current Status

✅ **Frontend Configuration**: Complete
✅ **Backend Configuration**: Complete  
✅ **Local Testing**: All tests passing
⏳ **Production Deployment**: Requires backend redeployment

## 🎯 Next Steps

1. **Deploy the updated backend** to apply CORS changes
2. **Redeploy the frontend** with the new configuration
3. **Test the live connection** between deployed applications
4. **Monitor for any issues** and adjust configuration as needed

The configuration is now ready for deployment. Once both applications are redeployed with these changes, they should communicate properly without CORS issues.
