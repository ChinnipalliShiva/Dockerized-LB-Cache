from node:latest

# Set the working directory
WORKDIR /dockerizedCache

# Copy the current directory contents into the container at /dockerizedCache
COPY . /dockerizedCache/

# Install any needed packages specified in requirements.txt
run npm init -y
run npm install redis mysql2 express --legacy-peer-deps

# Make port 80 available to the world outside this container
EXPOSE 7000

CMD [ "node", "index.js" ]
