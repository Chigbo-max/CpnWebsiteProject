# Use Node.js 20 base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy only the package files first (for better layer caching)
COPY package*.json ./

RUN npm cache clean --force
# Install dependencies cleanly using npm ci (recommended for production)
RUN npm install

# Copy all remaining source code AFTER installing dependencies
COPY . .

# Expose backend port
EXPOSE 5000

# Health check for container
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the app
CMD ["npm", "start"]
