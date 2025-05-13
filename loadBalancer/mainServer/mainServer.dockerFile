from node:latest

# Set the working directory
WORKDIR /mainServer

# Copy the package.json and package-lock.json files
copy . /mainServer/

expose 3000

run apt-get update && apt-get install -y \
    curl \
    gnupg \
    lsb-release
run npm init -y
run npm install express axios redis mysql2 jsonwebtoken

CMD [ "node","mainServer.js" ]

