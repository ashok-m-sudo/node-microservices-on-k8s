# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying all microservices.

## Prerequisites

- Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl configured
- Docker images built and pushed to registry

## Quick Deploy

Deploy all services at once:

```bash
kubectl apply -f deployment.yaml
```

## Verify Deployment

Check pods status:
```bash
kubectl get pods -n microservices
```

Check services:
```bash
kubectl get services -n microservices
```

Check deployments:
```bash
kubectl get deployments -n microservices
```

## Access Services

### Using Port Forwarding

```bash
# API Gateway
kubectl port-forward -n microservices service/api-gateway 3000:80

# Auth Service (direct access)
kubectl port-forward -n microservices service/auth-service 3001:3001

# Backend Service (direct access)
kubectl port-forward -n microservices service/backend-service 3002:3002
```

### Using LoadBalancer (Cloud)

Get external IP:
```bash
kubectl get service api-gateway -n microservices
```

## Scaling

Scale individual services:

```bash
# Scale API Gateway
kubectl scale deployment api-gateway -n microservices --replicas=5

# Scale Auth Service
kubectl scale deployment auth-service -n microservices --replicas=3

# Scale Backend Service
kubectl scale deployment backend-service -n microservices --replicas=3
```

## Update Deployment

Update image version:

```bash
kubectl set image deployment/api-gateway -n microservices \
  api-gateway=docker.io/api-gateway:v2.0

kubectl rollout status deployment/api-gateway -n microservices
```

## Rollback

```bash
kubectl rollout undo deployment/api-gateway -n microservices
```

## View Logs

```bash
# API Gateway logs
kubectl logs -f -n microservices deployment/api-gateway

# Auth Service logs
kubectl logs -f -n microservices deployment/auth-service

# Backend Service logs
kubectl logs -f -n microservices deployment/backend-service
```

## Cleanup

Remove all resources:

```bash
kubectl delete namespace microservices
```

Or delete specific deployment:

```bash
kubectl delete -f deployment.yaml
```

## Resource Management

Each service has defined resource limits:
- **Requests**: 128Mi memory, 100m CPU
- **Limits**: 256Mi memory, 200m CPU

Adjust these in the deployment.yaml based on your needs.

## Health Checks

All services have:
- **Liveness Probe**: Ensures container is running
- **Readiness Probe**: Ensures service is ready to accept traffic

## ConfigMaps and Secrets

- ConfigMaps store non-sensitive configuration
- Secrets store sensitive data (JWT_SECRET)

Update secrets:
```bash
kubectl create secret generic auth-service-secret \
  --from-literal=JWT_SECRET=new-secret-key \
  --namespace=microservices \
  --dry-run=client -o yaml | kubectl apply -f -
```

## Monitoring

Check resource usage:
```bash
kubectl top pods -n microservices
kubectl top nodes
```
