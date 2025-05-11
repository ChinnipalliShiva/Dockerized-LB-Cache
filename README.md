# Dockerized-LB-Cache

1. create docker image 
docker build -t cache-image -f sqldockerFile .

2. create container
docker run -d -p 3306:8000 --name cache-container cache-image

3. navigate to dockerizedSQL and run index.js file to create users data

----------------------------

