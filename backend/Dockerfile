# Use Node.js 20 base image
FROM node:20

# Set working directory to /app/backend
WORKDIR /app

# Copy only backend package files
COPY backend/package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy backend source code
COPY backend/ ./

# Expose backend port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the backend app
CMD ["npm", "start"]
