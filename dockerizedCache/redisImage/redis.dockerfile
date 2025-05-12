# Base Redis image
FROM redis:latest
# Set the working directory
# Default Redis start
CMD ["redis-server"]
