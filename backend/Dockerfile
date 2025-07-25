# Use Node.js 20 base image
FROM node:20

# Install PostgreSQL client tools (required for psql/pg_isready)
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Install production dependencies (use ci for exact versions)
RUN npm ci --only=production

# Copy all application files
COPY . .

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production
EXPOSE 5000

# Copy and prepare entrypoint
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Health check (matches Railway's requirements)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Use the entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]





# Use Node.js 20 base image
# FROM node:20

# Set working directory
# WORKDIR /app

# Copy only the package files first (for better layer caching)
# COPY package*.json ./

# Install dependencies cleanly using npm ci (recommended for production)
# RUN npm ci

# Copy all remaining source code AFTER installing dependencies
# COPY . .

# Expose backend port
# EXPOSE 5000

# Health check for container
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  # CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the app
# CMD ["npm", "start"]
