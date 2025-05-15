#!/bin/sh

# Wait for MySQL
echo "⏳ Waiting for MySQL at $DB_HOST:$DB_PORT..."
until nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 2
done


echo "✅ MySQL and Redis are up - starting the application"
exec "$@"
