const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type User {
   _id: ID
   username: String
   email: String
   bookCount: Int
   password: String
   savedBooks: [Book] 
}

type Auth {
    token: ID
    user: User
}

input bookInput {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type Query {
    user: User
}

type Mutation {
    addUser(username: String, email: String, password: String): Auth
    login(email: String, password: String): Auth
    removeBook(bookId: ID): User
    saveBook(bookData: bookInput): User
}
`
module.exports = typeDefs