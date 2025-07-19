#!/bin/bash

echo "🐳  Starting Docker Desktop..."

# Run the actual executable directly
"/c/Program Files/Docker/Docker/Docker Desktop.exe" &

# Wait for Docker backend process
while ! tasklist.exe | grep -q "com.docker.backend.exe"; do
  sleep 2
done

# Wait for Docker CLI to respond
echo "🔄  Waiting for Docker to start..."
until docker info &> /dev/null; do
  sleep 2
done
echo "----------------------------"

echo "✅  Docker is now running and ready to use!"
