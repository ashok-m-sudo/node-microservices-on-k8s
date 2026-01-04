# Node.js Microservices Template - DevOps Showcase

A production-ready microservices architecture built with Node.js, demonstrating modern DevOps practices including containerization, CI/CD, and Kubernetes orchestration.

## 🏗️ Architecture

This project consists of three microservices:

- **API Gateway** (Port 3000) - Entry point, request routing, and load balancing
- **Auth Service** (Port 3001) - User authentication and JWT token management
- **Backend Service** (Port 3002) - Sample business logic and data processing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Kubernetes cluster (optional, for K8s deployment)
- Jenkins (optional, for CI/CD)

### Local Development

```bash
# Install dependencies for all services
npm run install:all

# Run all services locally
npm run dev:all

# Or run individual services
cd api-gateway && npm run dev
cd auth-service && npm run dev
cd backend-service && npm run dev
```

### Docker Deployment

```bash
# Build all images
docker-compose build

# Run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Kubernetes Deployment

```bash
# Apply all deployments
kubectl apply -f k8s/

# Check status
kubectl get pods
kubectl get services

# Access services
kubectl port-forward service/api-gateway 3000:3000
```

## 📁 Project Structure

```
.
├── api-gateway/          # API Gateway service
│   ├── src/
│   ├── Dockerfile
│   ├── Jenkinsfile
│   └── k8s-deploy.yaml
├── auth-service/         # Authentication service
│   ├── src/
│   ├── Dockerfile
│   ├── Jenkinsfile
│   └── k8s-deploy.yaml
├── backend-service/      # Backend business logic
│   ├── src/
│   ├── Dockerfile
│   ├── Jenkinsfile
│   └── k8s-deploy.yaml
├── k8s/                  # Kubernetes manifests
├── docker-compose.yml    # Docker Compose configuration
└── README.md
```

## 🔧 DevOps Features

### Containerization
- Multi-stage Docker builds for optimized image sizes
- Docker Compose for local orchestration
- Health checks and proper signal handling

### CI/CD
- Jenkins pipelines for each service
- Automated testing and linting
- Docker image building and pushing
- Kubernetes deployment automation

### Kubernetes
- Deployment manifests with replica sets
- Service discovery and load balancing
- ConfigMaps and Secrets management
- Resource limits and requests
- Liveness and readiness probes

## 🔐 API Endpoints

### API Gateway (http://localhost:3000)
- `GET /health` - Health check
- `POST /api/auth/*` - Proxy to auth service
- `GET /api/backend/*` - Proxy to backend service

### Auth Service (http://localhost:3001)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/verify` - Verify JWT token

### Backend Service (http://localhost:3002)
- `GET /health` - Health check
- `GET /api/data` - Get sample data (requires auth)
- `POST /api/data` - Create sample data (requires auth)

## 🧪 Testing

```bash
# Run tests for all services
npm run test:all

# Run tests for individual service
cd api-gateway && npm test
```

## 📊 Monitoring

- Health check endpoints for all services
- Structured logging with Winston
- Request/response logging middleware

## 🔄 CI/CD Pipeline

Each service has its own Jenkinsfile that:
1. Checks out code
2. Installs dependencies
3. Runs linting
4. Runs tests
5. Builds Docker image
6. Pushes to registry
7. Deploys to Kubernetes

## 📝 Environment Variables

Create `.env` files in each service directory:

```env
# Auth Service
PORT=3001
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h

# Backend Service
PORT=3002
AUTH_SERVICE_URL=http://auth-service:3001

# API Gateway
PORT=3000
AUTH_SERVICE_URL=http://auth-service:3001
BACKEND_SERVICE_URL=http://backend-service:3002
```

## 🤝 Contributing

This is a template project for showcasing DevOps practices. Feel free to fork and customize for your needs.

## 📄 License

MIT License
