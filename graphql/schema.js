const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type User {
    user_id: ID!
    email: String!
    password: String
}

type Project{
    project_id: ID!
    project_name: String!
    user_id: ID!
}

type Challenge{
    challenge_id: ID!
    challenge_name: String!
    project_name: String!
    project_id: ID!
    challenge_type: String!
    challenge_is_selected: Boolean
}

type OQ{
    oq_id:ID!
    oq_name: ID!
    challenge_id: ID!
    challenge_name: String!
    project_name: String!
    project_id: ID!
    challenge_type: String!
    challenge_is_selected: Boolean
}

type Idea{
    idea_id:ID!
    idea_name: String!
    idea_effort: Boolean
    idea_impact: Boolean
    oq_id:ID!
    oq_name: ID!
    idea_is_selected: Boolean
    challenge_id: ID!
    challenge_name: String!
    project_name: String!
    project_id: ID!
    challenge_type: String!
    challenge_is_selected: Boolean
}

type Action{
    action_id:ID!
    action_what:String!
    action_due_date: String!
    action_test_until: String!
    action_succes_criteria: String!
    idea_id:ID!
    idea_name: String!
    idea_effort: Boolean
    idea_impact: Boolean
    oq_id:ID!
    oq_name: ID!
    idea_is_selected: Boolean
    challenge_id: ID!
    challenge_name: String!
    project_name: String!
    project_id: ID!
    challenge_type: String!
    challenge_is_selected: Boolean
}

type Message{
    message: String!
}

input CreateUserInputData {
    user_id: ID!
    email: String!
    password: String
}

input CreateProjectInputData {
    project_id: ID!
    project_name: String!
    user_id: ID!
}

input CreateChallengeInputData {
    challenge_id: ID!
    challenge_name: String!
    project_id: ID!
    challenge_type: String!
}

input CreateActionInputData {
    action_id:ID!
    action_what:String!
    action_due_date: String!
    action_test_until: String!
    action_succes_criteria: String!
    idea_id:ID!
}


input UpdateActionInputData {
    action_what:String!
    action_due_date: String!
    action_test_until: String!
    action_succes_criteria: String!
    action_id:ID!
}

type RootQuery {
    users:[User!]!
    project(project_id: ID!): Project!
    projects(user_id: ID!): [Project!]!
    challenges(project_id: ID!): [Challenge!]!
    challenge(project_id: ID!, challenge_id: ID! ): Challenge!
    chosenChallenges (project_id: ID!):[Challenge!]!
    oq(project_id: ID!, challenge_id: ID!): OQ!
    ideas(project_id: ID!, challenge_id: ID!): [Idea!]!
    idea(project_id: ID!, challenge_id: ID!, idea_id:ID!): Idea!
    chosenIdeas (project_id: ID!, challenge_id: ID!):[Idea!]!
    action(project_id: ID!, challenge_id: ID!, idea_id:ID!): Action!
    actions(user_id:ID!):[Action!]!
}

type RootMutation {
    createProject(createProjectInput: CreateProjectInputData): Message!
    updateProject(project_id:ID!, project_name: String!): Message!
    deleteProject(project_id:ID!): Message!
    createChallenge(createChallengeInput: CreateChallengeInputData): Message!
    selectChallenges(selectedIds: [Int!]!, project_id:ID!): Message!
    updateChallenge(challenge_id:ID!, challenge_name: String!): Message!
    deleteChallenge(challenge_id:ID!): Message!
    createOQ(challenge_id:ID!, oq_id:ID!, oq_name: String!): Message!
    updateOQ(oq_id:ID!, oq_name: String!): Message!
    deleteOQ(oq_id:ID!): Message!
    createIdea(idea_id:ID!, idea_name:String!, challenge_id:ID!): Message!
    selectIdeas(selectedIds: [Int!]!, challenge_id:ID!): Message!
    updateIdea(idea_id:ID!, idea_name: String!): Message!
    updateIdeaImpactEffort(idea_id:ID!, idea_impact_effort: String!, impact_effort_value:Boolean!): Message!
    deleteIdea(idea_id:ID!): Message!
    createAction(createActionInput:CreateActionInputData): Message!
    updateAction(updateActionInput:UpdateActionInputData): Message!
    deleteAction(action_id:ID!): Message!
    createUser(createUserInput: CreateUserInputData): Message!
    deleteUser(user_id:ID!): Message!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)