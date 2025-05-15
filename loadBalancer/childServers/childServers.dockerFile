# Use the official Node.js base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /childServer

# Copy application files into the container
COPY . .

# Update apt and install netcat-openbsd
RUN apt-get update && apt-get install -y netcat-openbsd

# Initialize npm and install dependencies
RUN npm init -y
RUN npm install express mysql2

# Copy waitScript.sh into the container and make it executable
COPY waitScript.sh /waitScript.sh
RUN chmod +x /waitScript.sh

# Expose ports that your servers will run on (example ports)
EXPOSE 3001
EXPOSE 3002
EXPOSE 3003

# Command to run your app with the waitScript.sh before starting the app
CMD ["/waitScript.sh", "node", "index.js"]
