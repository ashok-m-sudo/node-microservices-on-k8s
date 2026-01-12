# Node.js Microservices Template

A simple microservices architecture built with Node.js, demonstrating DevOps practices including Docker containerization, CI/CD with Jenkins, and Kubernetes deployment.

## Architecture

This project contains three microservices:

- **API Gateway** (Port 3000) - Entry point, request routing, and load balancing
- **Auth Service** (Port 3001) - User authentication and JWT token management
- **Backend Service** (Port 3002) - Sample business logic and data processing

## Tech Stack

- Node.js + Express
- Docker & Docker Compose
- Kubernetes
- Jenkins CI/CD
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Kubernetes cluster (optional, for K8s deployment)
- Jenkins (optional, for CI/CD)

### Local Development

```bash
# Install dependencies for all services
cd auth-service && npm install && cd ..
cd backend-service && npm install && cd ..
cd api-gateway && npm install && cd ..

# Start each service (in separate terminals)
cd auth-service && npm run dev
cd backend-service && npm run dev
cd api-gateway && npm run dev
```

### Quick Start with Docker Compose

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- API Gateway: http://localhost:3000
- Auth Service: http://localhost:3001
- Backend Service: http://localhost:3002

### Kubernetes Deployment

```bash
# Deploy all services
kubectl apply -f k8s/deployment.yaml

# Check deployment status
kubectl get pods -n microservices
kubectl get services -n microservices

# Access API Gateway
kubectl port-forward -n microservices service/api-gateway 3000:80
```

## API Usage

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

Save the token from the response.

### Create Data (requires authentication)

```bash
curl -X POST http://localhost:3000/api/backend/data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"Test Item","description":"Sample data"}'
```

### Get All Data

```bash
curl http://localhost:3000/api/backend/data \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Project Structure

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
├── backend-service/      # Backend service
│   ├── src/
│   ├── Dockerfile
│   ├── Jenkinsfile
│   └── k8s-deploy.yaml
├── k8s/                  # Kubernetes manifests
│   └── deployment.yaml
└── docker-compose.yml
```

## DevOps Features

### Docker
- Multi-stage builds for smaller images
- Health checks
- Non-root user execution
- Alpine Linux base images

### Kubernetes
- Deployments with multiple replicas
- ConfigMaps and Secrets
- Liveness and readiness probes
- Resource limits
- Service discovery

### CI/CD (Jenkins)
Each service has a Jenkinsfile that:
1. Runs tests and linting
2. Builds Docker image
3. Pushes to registry
4. Deploys to Kubernetes

## Configuration

Each service uses environment variables. Copy `.env.example` to `.env` in each service directory and update as needed.

**Important**: Change the JWT_SECRET in production!

## License

MIT
