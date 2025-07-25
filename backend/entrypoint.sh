#!/bin/sh
set -e

# Extract database connection details from Railway's DATABASE_URL
if [ -n "$DATABASE_URL" ]; then
  echo "Configuring Railway PostgreSQL database..."
  
  # Parse DATABASE_URL (postgres://user:pass@host:port/dbname)
  DB_USER=$(echo $DATABASE_URL | sed -e 's/^postgres:\/\/\([^:]*\).*/\1/')
  DB_PASS=$(echo $DATABASE_URL | sed -e 's/^postgres:\/\/[^:]*:\([^@]*\).*/\1/')
  DB_HOST=$(echo $DATABASE_URL | sed -e 's/^postgres:\/\/[^@]*@\([^:/]*\).*/\1/')
  DB_PORT=$(echo $DATABASE_URL | sed -e 's/^postgres:\/\/[^@]*@[^:]*:\([^/]*\).*/\1/')
  DB_NAME=$(echo $DATABASE_URL | sed -e 's/^postgres:\/\/[^@]*@[^:]*:[^/]*\/\(.*\)/\1/')

  # Wait for Railway Postgres to be ready (with timeout)
  echo "Waiting for Railway PostgreSQL to be ready..."
  timeout 15 bash -c "until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME; do sleep 1; done" || {
    echo "Failed to connect to Railway PostgreSQL!"
    exit 1
  }

  # Apply schema
  echo "Applying database schema..."
  PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f /app/config/schema.sql

  # Run migrations if using a migration system
  if [ -f "/app/node_modules/.bin/knex" ]; then
    echo "Running database migrations..."
    npx knex migrate:latest
  fi
fi

# Start the application
echo "Starting Node.js application..."
exec npm start