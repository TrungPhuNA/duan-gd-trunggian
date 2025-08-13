# SafeTrade Deployment Guide

## Overview

Hướng dẫn triển khai hệ thống SafeTrade lên môi trường production.

## System Requirements

### Server Requirements
- **OS**: Ubuntu 20.04 LTS hoặc CentOS 8+
- **CPU**: Minimum 2 cores, Recommended 4+ cores
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: Minimum 50GB SSD
- **Network**: Stable internet connection

### Software Requirements
- **Node.js**: v16.0.0+
- **MySQL**: v8.0+
- **Nginx**: v1.18+ (reverse proxy)
- **PM2**: Process manager
- **SSL Certificate**: Let's Encrypt hoặc commercial

## Pre-deployment Setup

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2
```

### 2. Database Setup

```bash
# Login to MySQL
sudo mysql -u root -p

# Create database and user
CREATE DATABASE safetrade_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'safetrade_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON safetrade_db.* TO 'safetrade_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Deployment Steps

### 1. Clone and Setup Project

```bash
# Clone repository
git clone https://github.com/your-repo/safetrade-system.git
cd safetrade-system

# Install dependencies
npm run install:all

# Build React app
cd client && npm run build && cd ..
```

### 2. Environment Configuration

```bash
# Copy environment file
cp server/.env.example server/.env

# Edit environment variables
nano server/.env
```

**Production Environment Variables:**
```env
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=safetrade_db
DB_USER=safetrade_user
DB_PASSWORD=your_strong_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-256-bits-long
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Email (Production SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-production-email@gmail.com
SMTP_PASS=your-app-password

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URL
CLIENT_URL=https://yourdomain.com

# File uploads
UPLOAD_PATH=/var/www/safetrade/uploads
MAX_FILE_SIZE=5242880
```

### 3. Database Migration

```bash
cd server
npm run db:migrate
npm run db:seed
```

### 4. PM2 Configuration

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'safetrade-api',
    script: './server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

Start application:
```bash
# Create logs directory
mkdir logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
```

### 5. Nginx Configuration

Create `/etc/nginx/sites-available/safetrade`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # API routes
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # File uploads
    location /uploads {
        alias /var/www/safetrade/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React app
    location / {
        root /var/www/safetrade/client/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/safetrade /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Post-deployment

### 1. Security Hardening

```bash
# Setup firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart ssh
```

### 2. Monitoring Setup

```bash
# Install monitoring tools
npm install -g pm2-logrotate
pm2 install pm2-logrotate

# Setup log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### 3. Backup Strategy

Create backup script `/home/ubuntu/backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u safetrade_user -p safetrade_db > $BACKUP_DIR/db_backup_$DATE.sql

# File backup
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /var/www/safetrade/uploads

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Setup cron job:
```bash
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup.sh
```

## Maintenance

### Application Updates

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm run install:all

# Build React app
cd client && npm run build && cd ..

# Run migrations
cd server && npm run db:migrate

# Restart application
pm2 restart safetrade-api
```

### SSL Certificate Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Setup auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Log Management

```bash
# View application logs
pm2 logs safetrade-api

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Clear logs
pm2 flush
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL service: `sudo systemctl status mysql`
   - Verify credentials in `.env`
   - Check firewall rules

2. **Application Won't Start**
   - Check Node.js version: `node --version`
   - Verify environment variables
   - Check PM2 logs: `pm2 logs`

3. **Nginx 502 Error**
   - Check if API is running: `pm2 status`
   - Verify proxy configuration
   - Check Nginx error logs

4. **SSL Issues**
   - Verify certificate: `sudo certbot certificates`
   - Check Nginx SSL configuration
   - Test SSL: `openssl s_client -connect yourdomain.com:443`

### Performance Optimization

1. **Database Optimization**
   - Add indexes for frequently queried columns
   - Optimize slow queries
   - Setup read replicas if needed

2. **Application Optimization**
   - Enable Redis caching
   - Optimize API responses
   - Use CDN for static assets

3. **Server Optimization**
   - Tune Nginx worker processes
   - Optimize PM2 cluster mode
   - Monitor resource usage

## Support

For deployment issues:
- Check logs first
- Review configuration files
- Contact development team
- Create GitHub issue with details
