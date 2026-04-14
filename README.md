# Pokemon NoSQL Project - Group 7

This project is a Node.js application designed to manage a Pokédex using a MongoDB atlas database.

###

git checkout noSQL

### Install dependencies

npm install

### Environment Variables Configuration (.env)

The project requires a MongoDB database to function. You must create a .env file in the root directory and add your connection URI:

MONGODB_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/pokemon

### Seed the Database
To populate the database with initial sample data (Bulbasaur, Charmander, etc.), run the following script:

node seedDatabase.js

### Running the Application

npm run start
Once the server is running, you can access the User Interface at:
👉 http://localhost:3001
