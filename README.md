# Node.js Microservices Template

A simple microservices architecture built with Node.js, demonstrating DevOps practices including Docker containerization, CI/CD with Jenkins, and Kubernetes deployment.

## Architecture

This project contains three microservices:

- **API Gateway** (Port 3000) - Entry point, request routing, and load balancing
- **Auth Service** (Port 3001) - User authentication and JWT token management
- **Backend Service** (Port 3002) - Sample business logic and data processing

## Tech Stack

- Node.js + Express
- JWT Authentication
- Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose

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

Services will be available at:
- API Gateway: http://localhost:3000
- Auth Service: http://localhost:3001
- Backend Service: http://localhost:3002

### Docker Deployment

**Using Docker Compose (Recommended):**

```bash
# Build and start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Stop and remove containers
docker compose down
```

**Using Docker Build (Individual Services):**

```bash
# Build images
docker build -t api-gateway:latest ./api-gateway
docker build -t auth-service:latest ./auth-service
docker build -t backend-service:latest ./backend-service

# Create network and run containers
docker network create microservices-network

# Run auth service
docker run -d --name auth-service --network microservices-network -p 3001:3001 \
  -e NODE_ENV=development \
  -e PORT=3001 \
  -e JWT_SECRET=your-super-secret-jwt-key \
  -e JWT_EXPIRY=24h \
  auth-service:latest

# Run backend service
docker run -d --name backend-service --network microservices-network -p 3002:3002 \
  -e NODE_ENV=development \
  -e PORT=3002 \
  -e AUTH_SERVICE_URL=http://auth-service:3001 \
  backend-service:latest

# Run API gateway
docker run -d --name api-gateway --network microservices-network -p 3000:3000 \
  -e NODE_ENV=development \
  -e PORT=3000 \
  -e AUTH_SERVICE_URL=http://auth-service:3001 \
  -e BACKEND_SERVICE_URL=http://backend-service:3002 \
  api-gateway:latest
```

Services will be available at:
- API Gateway: http://localhost:3000
- Auth Service: http://localhost:3001
- Backend Service: http://localhost:3002

## Testing the APIs

Quick test commands to verify the services are running:

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```
**Response:**
```json
{
  "message": "User registered successfully",
  "username": "testuser",
  "email": "test@example.com"
}
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```
**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### 3. Create Data (use token from login)
```bash
curl -X POST http://localhost:3000/api/backend/data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"Test Item","description":"Sample data"}'
```

### 4. Get Data
```bash
curl http://localhost:3000/api/backend/data \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## DevOps Features

### Docker
- Multi-stage builds for smaller images
- Health checks
- Non-root user execution
- Alpine Linux base images

## Configuration

Each service uses environment variables. Copy `.env.example` to `.env` in each service directory and update as needed.

**Important**: Change the JWT_SECRET in production!

## License

MIT
