# 🚀 Production CI/CD & AWS EC2 Deployment Guide

## Saki & Akku Birthday Gift Application
**Domain:** `pvsairamsaketh.in`  
**Subdomain for Birthday World:** `akku.pvsairamsaketh.in` (Coexisting with your existing project)

---

## 🏗️ 1. Architecture Overview

```
                    ┌─────────────────────────┐
                    │      Developer Git      │
                    │      (git push main)    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     GitHub Actions      │
                    │  CI: Pytest + Vite Build│
                    └────────────┬────────────┘
                                 │ CI Passed
                                 ▼
                    ┌─────────────────────────┐
                    │    Docker Hub Push      │
                    │ frontend + backend imgs │
                    └────────────┬────────────┘
                                 │ SSH Trigger
                                 ▼
       ┌────────────────────────────────────────────────────────┐
       │                     AWS EC2 Host                       │
       │                                                        │
       │              ┌───────────────────────────┐             │
       │              │  Nginx Host Reverse Proxy │             │
       │              │    (SSL / Let's Encrypt)  │             │
       │              └─────────────┬─────────────┘             │
       │                            │                           │
       │             ┌──────────────┴──────────────┐            │
       │             │                             │            │
       │             ▼                             ▼            │
       │    Existing Project              Birthday Project      │
       │    (pvsairamsaketh.in)     (akku.pvsairamsaketh.in)    │
       │    Port: 80 / 443 / 3000   Port: 8085 (Docker)         │
       │    [UNTOUCHED & SAFE]      ┌───────────────┐           │
       │                            │ Frontend (Web)│           │
       │                            │ Backend (Py)  │           │
       │                            │ Ollama (qwen) │           │
       │                            └───────────────┘           │
       └────────────────────────────────────────────────────────┘
```

---

## ⚡ 2. Recommended AWS EC2 Machine Type (No Performance Compromise)

Because this application runs **Ollama (`qwen2.5:3b`)**, semantic vector search, and TTS audio synthesis:

| Tier | EC2 Instance Type | Specs | Why This Type? |
| :--- | :--- | :--- | :--- |
| **High Performance (CPU)** ⭐ *Recommended* | **`c6i.xlarge`** or **`c7i.xlarge`** | 4 vCPUs, 8 GB RAM | Dedicated compute-optimized Intel/Graviton CPUs. Qwen 2.5 3B responds in ~1.2s without GPU cost. |
| **Balanced / Memory** | **`t3.xlarge`** | 4 vCPUs, 16 GB RAM | Generous RAM for running Ollama models, Django, ChromaDB, and your existing project together. |
| **Maximum Ultra-Speed (GPU)** | **`g4dn.xlarge`** | 4 vCPUs, 16 GB RAM, 1x NVIDIA T4 (16GB VRAM) | Sub-second GPU inference. Recommended if you want instantaneous streaming. |

> [!IMPORTANT]
> Avoid `t2.micro` or `t3.micro` for Ollama, as 1 GB RAM will trigger Out-Of-Memory (OOM) errors.

---

## 🔒 3. AWS Security Group Configuration

In the AWS EC2 Console, configure your instance's Security Group Inbound Rules:

| Type | Port Range | Source | Description |
| :--- | :--- | :--- | :--- |
| **SSH** | 22 | `0.0.0.0/0` (or your IP) | Required for GitHub Actions CD & Terminal access |
| **HTTP** | 80 | `0.0.0.0/0` | Web traffic & Let's Encrypt verification |
| **HTTPS** | 443 | `0.0.0.0/0` | Secure SSL web traffic |

*Internal ports (8000, 8085, 11434) do NOT need to be open to the public internet because Host Nginx proxies them locally.*

---

## 🌐 4. GoDaddy DNS Configuration

1. Log into **GoDaddy Domain Control Center**.
2. Go to **Domains** → Select **`pvsairamsaketh.in`** → **Manage DNS**.
3. Add a new Record for the subdomain:
   * **Type:** `A`
   * **Name:** `akku`
   * **Value:** `<Your-EC2-Public-IPv4-Address>`
   * **TTL:** `1/2 Hour` (or Default)

*(Result: `akku.pvsairamsaketh.in` points directly to your EC2 instance while `pvsairamsaketh.in` remains unaffected).*

---

## 🖥️ 5. One-Time Setup on Your EC2 Instance

Connect to your EC2 server once via terminal:
```bash
ssh -i your-key.pem ubuntu@<your-ec2-ip>
```

### Step 5.1: Install Docker & Docker Compose Plugin
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg nginx certbot python3-certbot-nginx

# Install Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Allow ubuntu user to run Docker without sudo
sudo usermod -aG docker $USER
newgrp docker
```

### Step 5.2: Configure Nginx for `akku.pvsairamsaketh.in`
Create the Nginx site configuration:
```bash
sudo nano /etc/nginx/sites-available/akku.pvsairamsaketh.in
```

Paste the following:
```nginx
server {
    listen 80;
    server_name akku.pvsairamsaketh.in;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:8085;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # SSE Streaming for AI Chat
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }
}
```

Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/akku.pvsairamsaketh.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5.3: Issue Free SSL Certificate (Let's Encrypt)
```bash
sudo certbot --nginx -d akku.pvsairamsaketh.in
```
Certbot will automatically configure HTTPS redirect (`http` → `https`) and auto-renewal.

---

## 🔑 6. GitHub Repository Secrets Configuration

In your GitHub repository (`https://github.com/pvsairamsaketh-netizen/akkubdaygift`):
1. Navigate to **Settings** → **Secrets and variables** → **Actions**.
2. Click **New repository secret** and add the following 5 secrets:

| Secret Name | Example / Value | Description |
| :--- | :--- | :--- |
| **`DOCKERHUB_USERNAME`** | `pvsairamsaketh` | Your Docker Hub account username |
| **`DOCKERHUB_TOKEN`** | `dckr_pat_xxxx` | Docker Hub Personal Access Token (from Docker Hub Account Settings → Security) |
| **`EC2_HOST`** | `13.xxx.xxx.xxx` | Your EC2 Public IPv4 address |
| **`EC2_USER`** | `ubuntu` | Default SSH user (e.g. `ubuntu` for Ubuntu AMI) |
| **`EC2_SSH_KEY`** | `-----BEGIN RSA PRIVATE KEY-----...` | Entire contents of your `.pem` SSH private key |

---

## 🚢 7. How to Trigger Deployment

Every time you push code to `main`:
```bash
git add .
git commit -m "Deploy: Saki & Akku Birthday Experience"
git push origin main
```

1. **GitHub Actions** runs all unit tests and builds the Vite frontend.
2. Builds and tags production Docker images and pushes them to Docker Hub.
3. SSH connects to your EC2 instance, pulls the images, restarts containers on port `8085`, and verifies health at `http://localhost:8085/api/health/`.
4. Your girlfriend visits `https://akku.pvsairamsaketh.in` and experiences the romantic locked secret & birthday surprise!
