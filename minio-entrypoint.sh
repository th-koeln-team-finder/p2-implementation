#!/bin/sh

# Set MinIO credentials
export MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY:-minioadmin}
export MINIO_SECRET_KEY=${MINIO_SECRET_KEY:-minioadmin}

# Start MinIO server in the background
minio server /data --console-address ':9090' &

# Wait for MinIO server to be up
until curl -s http://localhost:9000/minio/health/live; do
  echo "Waiting for MinIO server to start..."
  sleep 5
done

# Configure MinIO client and create the default bucket
mc alias set myminio http://localhost:9000 $MINIO_ACCESS_KEY $MINIO_SECRET_KEY
mc mb myminio/${MINIO_DEFAULT_BUCKET}

# Keep the container running
tail -f /dev/null
