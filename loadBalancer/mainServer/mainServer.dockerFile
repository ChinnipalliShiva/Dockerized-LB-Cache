from node:latest

# Set the working directory
WORKDIR /mainServer

run apt-get update && apt-get install -y \
    curl \
    gnupg \
    lsb-release
run npm init -y
run npm install express axios redis mysql2

