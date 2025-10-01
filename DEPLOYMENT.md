# 🚀 Deployment Configuration Guide

This guide explains how to configure the application for different environments (local, staging, production).

## 📁 Environment Files

### `.env.local` - Local Development
```bash
# For local development with localhost
VITE_API_BASE_URL=http://localhost:5050
VITE_PLAYGROUND_URL=http://localhost:5004
VITE_DEV_MODE=true
```

### `.env.staging` - Staging Environment  
```bash
# For staging/testing with remote URLs
VITE_API_BASE_URL=https://debtai-fefaf5dtbgd8aqg6.canadacentral-01.azurewebsites.net
VITE_PLAYGROUND_URL=https://debtai-fefaf5dtbgd8aqg6.canadacentral-01.azurewebsites.net:5004
VITE_DEV_MODE=false
```

### `.env.production` - Production Environment
```bash
# For production deployment
VITE_API_BASE_URL=https://your-production-domain.com
VITE_PLAYGROUND_URL=https://your-production-domain.com:5004
VITE_PRODUCTION_MODE=true
```

## 🛠️ Development Commands

### Local Development (localhost)
```bash
# Start development server with localhost URLs
npm run dev:local
# or
npm run dev
```

### Staging Development (remote URLs)
```bash
# Start development server with remote URLs
npm run dev:staging
```

## 🏗️ Build Commands

### Build for Local Testing
```bash
npm run build:local
```

### Build for Staging
```bash
npm run build:staging
```

### Build for Production
```bash
npm run build:production
```

## 🔧 Automatic Environment Detection

The application automatically detects the environment and uses appropriate URLs:

- **Development**: Uses localhost URLs
- **Production**: Uses remote URLs
- **Manual Override**: Set `VITE_API_BASE_URL` in environment files

## 🌐 URL Configuration

### Local Development
- **API**: `http://localhost:5050`
- **Playground**: `http://localhost:5004`

### Remote/Production
- **API**: `https://debtai-fefaf5dtbgd8aqg6.canadacentral-01.azurewebsites.net`
- **Playground**: `https://debtai-fefaf5dtbgd8aqg6.canadacentral-01.azurewebsites.net:5004`

## 📝 Environment Variables

| Variable | Description | Local | Production |
|----------|-------------|-------|------------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5050` | `https://your-domain.com` |
| `VITE_PLAYGROUND_URL` | Voice playground URL | `http://localhost:5004` | `https://your-domain.com:5004` |
| `VITE_DEV_MODE` | Development mode flag | `true` | `false` |
| `VITE_PRODUCTION_MODE` | Production mode flag | `false` | `true` |

## 🚀 Deployment Steps

1. **Choose Environment**: Select appropriate `.env.*` file
2. **Set URLs**: Update `VITE_API_BASE_URL` and `VITE_PLAYGROUND_URL`
3. **Build**: Run appropriate build command
4. **Deploy**: Upload build files to your hosting service

## 🔍 Debugging

Check browser console for API configuration logs:
```
🔧 API Configuration: {
  baseUrl: "http://localhost:5050",
  playgroundUrl: "http://localhost:5004",
  isDevelopment: true,
  isProduction: false
}
```