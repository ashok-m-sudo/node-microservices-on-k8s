# Kubernetes Deployment Guide

This project uses **GitHub Container Registry (GHCR)** for container image management - the industry-standard approach used by major organizations.

## Prerequisites

- Kubernetes cluster (Minikube, Kind, GKE, EKS, AKS, etc.)
- `kubectl` configured
- Docker installed
- GitHub account

## Quick Start

### 1. Build and Push Images to GHCR

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Build and push all images
./scripts/build-and-push.sh --username YOUR_GITHUB_USERNAME
```

**Note:** Create a GitHub Personal Access Token with `write:packages` scope at:  
https://github.com/settings/tokens

### 2. Update Kubernetes Configuration

Edit `k8s/kustomization.yaml` and replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:

```yaml
images:
  - name: api-gateway
    newName: ghcr.io/your-actual-username/api-gateway
    newTag: latest
```

### 3. Make Packages Public

Visit https://github.com/YOUR_USERNAME?tab=packages and set each package to **Public**.

### 4. Deploy to Kubernetes

```bash
# Deploy all services
kubectl apply -k k8s/

# Verify deployment
kubectl get all -n microservices

# Check pods
kubectl get pods -n microservices
```

### 5. Access the Application

```bash
# Port forward to access locally
kubectl port-forward -n microservices service/api-gateway 3000:3000

# Visit: http://localhost:3000
```

## Automated CI/CD with GitHub Actions

The project includes a GitHub Actions workflow that automatically builds and pushes images on every push to `main`.

**Workflow file:** `.github/workflows/docker-build-push.yml`

Just push your code to GitHub:
```bash
git add .
git commit -m "Deploy to Kubernetes"
git push
```

GitHub Actions will automatically:
- Build all Docker images
- Push to GHCR
- Tag with version and commit SHA

## Image Versioning

Build with semantic versioning:
```bash
./scripts/build-and-push.sh --username YOUR_USERNAME --version v1.0.0
```

This creates two tags:
- `v1.0.0` - Specific version
- `latest` - Latest version

## Useful Commands

```bash
# View logs
kubectl logs -f deployment/api-gateway -n microservices

# Scale deployment
kubectl scale deployment/api-gateway --replicas=3 -n microservices

# Update image
kubectl set image deployment/api-gateway api-gateway=ghcr.io/username/api-gateway:v2.0.0 -n microservices

# Delete deployment
kubectl delete -k k8s/
```

## For Jenkins Integration

The deployment is Jenkins-ready. Use this in your Jenkinsfile:

```groovy
stage('Build and Push') {
    steps {
        sh './scripts/build-and-push.sh --username ${GITHUB_USERNAME}'
    }
}

stage('Deploy to Kubernetes') {
    steps {
        sh 'kubectl apply -k k8s/'
    }
}
```

## Architecture

- **Container Registry:** GitHub Container Registry (GHCR)
- **Orchestration:** Kubernetes with Kustomize
- **CI/CD:** GitHub Actions (Jenkins-compatible)
- **Image Management:** Automated builds with versioning

## Why GHCR?

✅ **Industry Standard** - Used by major organizations  
✅ **Free & Integrated** - Built into GitHub  
✅ **CI/CD Ready** - Works with GitHub Actions and Jenkins  
✅ **Secure** - Fine-grained access control  
✅ **Professional** - Shows modern DevOps practices  

## Troubleshooting

### ImagePullBackOff Error
- Ensure packages are public on GitHub
- Verify image names in `k8s/kustomization.yaml`
- Check GHCR authentication

### Authentication Issues
```bash
# Re-login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

### Image Not Found
- Verify images were pushed: `docker images | grep ghcr.io`
- Check package visibility on GitHub
