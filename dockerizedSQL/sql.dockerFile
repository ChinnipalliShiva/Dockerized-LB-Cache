# Use MySQL official image as base
FROM mysql:8.0.33-oracle

# Set environment variables for the MySQL container
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=testdb
ENV MYSQL_USER=testuser
ENV MYSQL_PASSWORD=testpass

# Expose MySQL port
EXPOSE 3306
