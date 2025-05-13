FROM node:latest

# Set the working directory
WORKDIR /childServer

# Copy application files into the container
COPY . .

# Initialize npm and install dependencies
RUN npm init -y
RUN npm install express mysql2

# Expose a port if your server listens on one (e.g., 3000)
EXPOSE 3001
EXPOSE 3002
EXPOSE 3003

# Command to run your app
CMD ["node", "index.js"]

