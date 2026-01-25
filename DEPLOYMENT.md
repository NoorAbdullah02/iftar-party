# 🚀 Deployment Guide - চড়ুইভাতি ২০২৬

## Production Deployment Checklist

### Pre-Deployment

- [ ] All features tested locally
- [ ] Database migrations successful
- [ ] Email system working
- [ ] Admin account created
- [ ] Test data cleared (if needed)

---

## Option 1: Vercel (Frontend) + Railway (Backend + Database)

### Step 1: Deploy Database (Railway)

1. Go to [Railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Copy connection string
5. Note down:
   - `DATABASE_URL`
   - Host, Port, Database name

### Step 2: Deploy Backend (Railway)

1. In same Railway project, click "New Service"
2. Select "GitHub Repo"
3. Connect your repository
4. Set root directory to `/Backend`
5. Add environment variables:
   ```
   DATABASE_URL=<from Railway PostgreSQL>
   JWT_SECRET=<generate strong random string>
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=<your-vercel-domain>
   EMAIL_USER=<your-email>
   EMAIL_PASS=<app-specific-password>
   EMAIL_FROM=ICE Department <your-email>
   ```
6. Deploy
7. Note your backend URL (e.g., `https://your-app.up.railway.app`)

### Step 3: Run Database Migrations

```bash
# From your local machine
DATABASE_URL=<railway-database-url> npx drizzle-kit push
```

### Step 4: Deploy Frontend (Vercel)

1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `/frontend`
4. Add environment variable:
   ```
   VITE_API_URL=<your-railway-backend-url>
   ```
5. Deploy
6. Note your frontend URL

### Step 5: Update Backend CORS

Update `FRONTEND_URL` in Railway backend environment to your Vercel URL.

---

## Option 2: Single Server (VPS - DigitalOcean, AWS, etc.)

### Step 1: Server Setup

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx
apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2
```

### Step 2: Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE picnic_db;
CREATE USER picnic_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE picnic_db TO picnic_user;
\q
```

### Step 3: Clone and Setup Backend

```bash
# Clone repository
cd /var/www
git clone <your-repo-url> picnic
cd picnic/Backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add all production environment variables

# Run migrations
npx drizzle-kit push

# Start with PM2
pm2 start npm --name "picnic-backend" -- run dev
pm2 save
pm2 startup
```

### Step 4: Build and Setup Frontend

```bash
cd /var/www/picnic/frontend

# Create .env
nano .env
# Add VITE_API_URL=http://your-domain.com/api

# Build
npm install
npm run build

# Copy build to nginx directory
cp -r dist /var/www/picnic-frontend
```

### Step 5: Configure Nginx

```bash
nano /etc/nginx/sites-available/picnic
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/picnic-frontend;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/picnic /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 6: SSL Certificate (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## Option 3: Render (Full Stack)

### Step 1: Deploy Database

1. Go to [Render.com](https://render.com)
2. New → PostgreSQL
3. Create database
4. Copy Internal Database URL

### Step 2: Deploy Backend

1. New → Web Service
2. Connect repository
3. Settings:
   - Root Directory: `Backend`
   - Build Command: `npm install && npx drizzle-kit push`
   - Start Command: `npm run dev`
4. Add environment variables (same as Railway)
5. Deploy

### Step 3: Deploy Frontend

1. New → Static Site
2. Connect repository
3. Settings:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=<your-render-backend-url>
   ```
5. Deploy

---

## Post-Deployment

### 1. Test Everything

- [ ] Visit landing page
- [ ] Test registration flow
- [ ] Check email delivery
- [ ] Login to admin dashboard
- [ ] Test all admin features
- [ ] Download CSV reports
- [ ] Test on mobile devices

### 2. Create Admin Account

1. Visit `/register`
2. Create admin account
3. Verify email
4. Login

### 3. Monitor

```bash
# If using PM2
pm2 logs picnic-backend
pm2 monit

# Check Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### 4. Backup Strategy

```bash
# Database backup (cron job)
0 2 * * * pg_dump picnic_db > /backups/picnic_$(date +\%Y\%m\%d).sql

# Keep last 7 days
find /backups -name "picnic_*.sql" -mtime +7 -delete
```

---

## Environment Variables Reference

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=<64-char-random-string>
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=<app-specific-password>
EMAIL_FROM=ICE Department <your-email@gmail.com>
```

### Frontend (.env)
```env
VITE_API_URL=https://api.your-domain.com
```

---

## Security Checklist

- [ ] Strong JWT_SECRET (64+ characters)
- [ ] Database password is strong
- [ ] SSL certificate installed
- [ ] CORS configured correctly
- [ ] Environment variables secured
- [ ] Firewall configured (if VPS)
- [ ] Regular backups enabled
- [ ] PM2 process monitoring (if applicable)

---

## Performance Optimization

### Frontend
- ✅ Already using Vite (optimized builds)
- ✅ Lazy loading components
- ✅ Optimized images
- ✅ GSAP animations optimized

### Backend
- Consider adding Redis for caching
- Enable gzip compression in Nginx
- Use CDN for static assets

### Database
- Add indexes on frequently queried fields:
  ```sql
  CREATE INDEX idx_registrations_batch ON registrations(batch);
  CREATE INDEX idx_registrations_payment ON registrations(payment_status);
  CREATE INDEX idx_registrations_email ON registrations(email);
  ```

---

## Troubleshooting

### Email Not Sending in Production
- Check EMAIL_USER and EMAIL_PASS
- Verify Gmail App-Specific Password
- Check server firewall allows SMTP (port 587)

### Database Connection Failed
- Verify DATABASE_URL format
- Check database server is running
- Verify network access (whitelist IP if needed)

### CORS Errors
- Ensure FRONTEND_URL matches exactly
- Check CORS configuration in backend
- Verify environment variables loaded

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Monitoring & Maintenance

### Health Checks
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor error logs
- Track email delivery rates

### Regular Tasks
- Weekly: Check error logs
- Monthly: Review database size
- Quarterly: Update dependencies
- Yearly: Renew SSL certificate (if not auto-renewed)

---

## Support

For issues or questions:
1. Check logs first
2. Review environment variables
3. Test locally with production env
4. Check database connectivity

---

🌸 **Your চড়ুইভাতি – ২০২৬ app is now live!** 🌿

**Recommended: Start with Option 1 (Vercel + Railway) for easiest deployment**
