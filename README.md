# Node.js Microservices on Kubernetes

A complete microservices architecture template demonstrating **Local Development**, **Docker Compose**, **Kubernetes (K8s)**, and **CI/CD** pipelines with **Jenkins** & **GitHub Actions**.

Built with industry-standard practices using **GitHub Container Registry (GHCR)**.

---

##  Architecture

This project consists of three microservices:
1.  **API Gateway** (`:3000`): Entry point, request routing, and load balancing.
2.  **Auth Service** (`:3001`): User registration and JWT authentication.
3.  **Backend Service** (`:3002`): Business logic and data processing.

## Tech Stack

- Node.js + Express
- JWT Authentication
- Docker & Docker Compose
- Kubernetes

---

##  Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Kubernetes cluster (optional, for K8s deployment)

###  Local Development (Node.js)

Run each service individually for development and debugging.

```bash
# Install dependencies
cd auth-service && npm install
cd backend-service && npm install
cd api-gateway && npm install

# Start services (run in separate terminals)
# Terminal 1
cd auth-service && npm run dev

# Terminal 2
cd backend-service && npm run dev

# Terminal 3
cd api-gateway && npm run dev
```
**Access:** `http://localhost:3000`

---

### Docker Deployment 

The easiest way to run the entire stack locally.

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
**Access:** `http://localhost:3000`

---

### Kubernetes Deployment (Production-Ready)

This project simulates a real-world production setup using **GHCR** for images and **Kustomize** for configuration.

**👉 See the [Detailed Kubernetes Guide](k8s/README.md) for full setup instructions.**

#### Quick Start:
1.  **Build & Push Images:**
    ```bash
    # Login to GHCR first! (See k8s/README.md for token instructions)
    export GITHUB_TOKEN=your_token
    ./scripts/build-and-push.sh --username YOUR_GITHUB_USERNAME
    ```

2.  **Deploy to Cluster:**
    ```bash
    # Update k8s/kustomization.yaml with your username first!
    kubectl apply -k k8s/
    ```

3.  **Access the Application:**
    In a real cluster, you'd use an Ingress. For local testing (Minikube/Kind), use port-forwarding:
    ```bash
    kubectl port-forward -n microservices svc/api-gateway 3000:3000
    ```
    **Visit:** `http://localhost:3000`

---

## CI/CD Pipelines

### GitHub Actions
Automatically builds and pushes docker images to GHCR on every push to the `main` branch.
- Config file: `.github/workflows/docker-build-push.yml`

### Jenkins
A production-ready `Jenkinsfile` is included for automated deployments.
- Pipeline steps: Checkout -> Build -> Push to GHCR -> Deploy to K8s.
- **Setup:** Create a pipeline job and point it to this repo.

---

## Testing the API

You can test the API using `curl` or Postman on `http://localhost:3000`.

**1. Register User**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**2. Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

---

## 📝 License

MIT
