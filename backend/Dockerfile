# Use Node.js 20 base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy only the package files first (for better layer caching)
COPY package*.json ./

# Install dependencies cleanly using npm ci (recommended for production)
RUN npm ci

# Copy all remaining source code AFTER installing dependencies
COPY . .

# Expose backend port

ENV PORT=5000
EXPOSE 5000

# Health check for container
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1


RUN npm install -g pg
# Start the app
CMD [""npm", "start", sh", "-c", "psql $DATABASE_URL < /backend/config/schema.sql && node server.js"]
