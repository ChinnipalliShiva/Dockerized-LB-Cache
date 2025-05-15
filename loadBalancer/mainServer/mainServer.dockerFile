# Use the official Node.js base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /mainServer

# Copy the current directory contents into the container at /mainServer
COPY . /mainServer/

# Expose the port that the app will run on
EXPOSE 3000

# Install netcat (nc) for port checking
RUN apt-get update && apt-get install -y netcat-openbsd

# Install Node.js dependencies
RUN npm install express axios redis mysql2 jsonwebtoken

# Copy the waitScript.sh into the container
COPY waitScript.sh /waitScript.sh

# Make the waitScript.sh executable
RUN chmod +x /waitScript.sh

# Run the waitScript.sh before starting the app
CMD ["/waitScript.sh", "node", "mainServer.js"]
