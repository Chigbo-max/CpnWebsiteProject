
# Use Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies

COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Install `serve` globally to serve the production build
RUN npm install -g serve

# Expose the port that `serve` will use
EXPOSE 80

# Healthcheck (optional but useful)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Serve the app using `serve`
CMD ["serve", "-s", "dist", "-l", "80"]





# Build stage
# FROM node:20 AS build

# WORKDIR /app

# Copy package files
# COPY package*.json ./

# Install dependencies
# RUN npm ci

# Copy source code
# COPY . .

# Build the application
# RUN npm run build

# Production stage
# FROM nginx:alpine

# Copy built files from build stage
# COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
# EXPOSE 80

# Health check
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  # CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
# CMD ["-g", "daemon off;"] 