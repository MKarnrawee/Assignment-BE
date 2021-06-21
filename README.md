# SCB-Assignment-BE-

For this assignment, I used Visual Studio Code as a program editor, NodeJS as a platform runtime environment and Postman as an API testing tool.
I created a user.json file to simulate my DB. And app.js file to be my main file which includes all logic program supports the inquiries.

To run the server
1. clone all project
2. npm install
3. node app.js

cUrls
1. /login POST
curl --location --request POST 'localhost:8000/login' \
--header 'Content-Type: application/json' \
--data-raw '{"username":"john.doe","password":"thisismysecret"}'

2. /users GET (required login from 1.)
curl --location --request GET 'localhost:8000/users' \
--data-raw ''

3. /users POST
curl --location --request POST 'localhost:8000/users' \
--header 'Content-Type: application/json' \
--data-raw '{"username":"john.doe","password":"thisismysecret","date_of_birth":"15/01/1985"}'

4. /users/orders POST (required login from 1.)
curl --location --request POST 'localhost:8000/users/orders' \
--header 'Content-Type: application/json' \
--data-raw '{"orders":[1,4]}'

5. /books GET
curl --location --request GET 'localhost:8000/books' \
--data-raw ''
