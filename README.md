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

## Getting Started

### Prerequisites

- Node.js 18+

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

## Configuration

Each service uses environment variables. Copy `.env.example` to `.env` in each service directory and update as needed.

**Important**: Change the JWT_SECRET in production!

## License

MIT
