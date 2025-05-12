#!/bin/bash
set -e

echo "copy env file..."
cp .env.example .env

echo "Installing dependencies..."
npm install

echo "verify docker is running..."
docker compose -f docker-compose.dev.yml up -d

echo "await database to be ready..."
until docker compose -f docker-compose.dev.yml exec postgres-test pg_isready -U postgres -h 127.0.0.1
do
  echo "Waiting for database to be ready..."
  sleep 1 
done

echo "reset database..."
npm run reset:db

echo "Running tests..."
npm run test