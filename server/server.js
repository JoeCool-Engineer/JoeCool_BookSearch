const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');

// What is the deconstructor naming convention or practice
const { authMiddleware } = require('./utils/auth');
// Importing schema file from index
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;
// Assumption: Server will only run the schema file once auth is complete.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware, 
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  })
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);