const { buildSchema } = require('graphql');


module.exports = buildSchema(`
   type Post {
      _id: ID!
      title: String!
      content: String!
      imageURL: String!
      creator: User!
      createdAt: String!
      updatedAt: String!
   }

   type User {
      _id: ID!
      name: String!
      email: String!
      password: String!
      status: String!
      posts: [Post!]!
   }

   type AuthDate {
      token: String!
      userId: String!
   }

   input PostInputData {
      title: String!
      content: String!
      imageUrl: String!
   }

   input UserInputData {
      email: String!
      name: String!
      password: String!
   }

   type RootQuery {
      login(email: String!, password: String!): AuthDate!
   }

   type RootMutation {
      createUser(userInput: UserInputData): User!
      createPost(postInput: PostInputData): Post!
   }

   schema {
      query: RootQuery
      mutation: RootMutation
   }
`);