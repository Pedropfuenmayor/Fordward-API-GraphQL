const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type User {
    id: ID!
    email: String!
    password: String
}

type Project{
    id: ID!
    name:String!
    user_id: Int!
}

input ProjectInputData {
    id: ID!
    name: String!
    user_id: Int!
}

type RootQuery {
    project(id: ID!): Project!
    projects(user_id: Int!): [Project!]!
}

type RootMutation {
    createProject(projectInput: ProjectInputData): Project!
    
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)