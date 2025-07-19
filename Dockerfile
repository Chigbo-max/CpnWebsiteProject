# -------- Stage 1: Build Frontend --------
FROM node:20 AS frontend

WORKDIR /app/frontend

# Copy frontend source
COPY frontEnd/cpnui/ ./

# Disable Rollup native binary (must come BEFORE npm install)
ENV ROLLUP_NO_BINARY=true

# Clean previous installs
RUN rm -rf package-lock.json node_modules
RUN npm cache clean --force


COPY frontEnd/cpnui/.npmrc ./


# Install dependencies

RUN npm install --legacy-peer-deps

# Install missing FontAwesome packages
RUN npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome

# Build frontend
RUN npm run build


# -------- Stage 2: Build Backend --------
FROM node:20 AS backend

WORKDIR /app

# Copy backend source
COPY backend ./backend

# Copy frontend build into backend's public dir
COPY --from=frontend /app/frontend/dist ./backend/public

WORKDIR /app/backend

# Install backend deps
RUN npm install

EXPOSE 5000

CMD ["node", "server.js"]
