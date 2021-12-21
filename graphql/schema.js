const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type User {
    id: ID!
    email: String!
    password: String
}

type Project{
    id: ID!
    name: String!
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

input CreateProjectInputData {
    id: ID!
    name: String!
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
    idea_id:ID!
}

type RootQuery {
    project(id: ID!): Project!
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
    createProject(createProjectInput: CreateProjectInputData): Boolean!
    updateProject(id:ID!, name: String!): Boolean!
    deleteProject(id:ID!): Boolean!
    createChallenge(createChallengeInput: CreateChallengeInputData): Boolean!
    selectChallenges(selectedIds: [Int!]!): Boolean!
    updateChallenge(challenge_id:ID!, challenge_name: String!): Boolean!
    deleteChallenge(challenge_id:ID!): Boolean!
    createOQ(challenge_id:ID!, oq_id:ID!, oq_name: String!): Boolean!
    updateOQ(oq_id:ID!, oq_name: String!): Boolean!
    deleteOQ(oq_id:ID!): Boolean!
    createIdea(idea_id:ID!, idea_name:String!, challenge_id:ID!): Boolean!
    selectIdeas(selectedIds: [Int!]!): Boolean!
    updateIdea(idea_id:ID!, idea_name: String!): Boolean!
    updateIdeaImpactEffort(idea_id:ID!, idea_impact_effort: String!, impact_effort_value:Boolean!): Boolean!
    deleteIdea(idea_id:ID!): Boolean!
    createAction(createActionInput:CreateActionInputData): Boolean!
    updateAction(updateActionInput:UpdateActionInputData): Boolean!
    deleteAction(action_id:ID!): Boolean!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)