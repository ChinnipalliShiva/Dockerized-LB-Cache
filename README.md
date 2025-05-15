# Dockerized-LB-Cache

1. create docker image 
docker build -t cache-image -f sqldockerFile .

2. create container
docker run -d -p 3306:8000 --name cache-container cache-image

3. navigate to dockerizedSQL and run index.js file to create users data

----------------------------

changed above functionality by using docker compose
1. In compose had all image config of sql,redis,load balancer and child servers.
2. running LB at 3000 and included internally child servers.
3. As soon as server starts it inserts some data to SQL and check for jwt token in files.
4. with that token hit api - /getUser with below payload
    {
        "username":"name",
        "useremail":"email"
    }


-----
gitPus is used to commit and push code to gitHub - 1 file at a time.


