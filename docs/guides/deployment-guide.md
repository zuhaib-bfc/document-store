# Deployment Guide

## Prerequisites

- Node.js 18+
- Docker
- AWS CLI configured

## Deployment Steps

### 1. Build the Application

```bash
npm run build
```

### 2. Create Docker Image

```bash
docker build -t document-store .
```

### 3. Deploy to Production

```bash
docker run -p 3000:3000 document-store
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `DB_URL` | Database URL | localhost |

## Monitoring

- Health check endpoint: `/health`
- Metrics endpoint: `/metrics`
- Logs are available in CloudWatch