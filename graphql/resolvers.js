const Project = require("../models/projects");
const Challenge = require("../models/challenges");
const OQ = require("../models/OQ");

module.exports = {
  Query: {
    projects: async function (_, { user_id }) {
      const { rows: projects } = await Project.fetchAll(user_id);
      if (projects.length === 0) {
        const error = new Error("No project found!");
        error.code = 404;
        throw error;
      }
      return projects;
    },
    oq: async function (_, { project_id, challenge_id }) {
      const { rows: oq } = await OQ.fetchOQ(project_id, challenge_id);
      if (!oq) {
        const error = new Error("No OQ found!");
        error.code = 404;
        throw error;
      }
      return oq[0];
    },
  },
  Project: {
    challenges: async function ({ project_id }, args, context) {
        const { challengeLoader } = context;
      const challenges = challengeLoader.load(project_id);
      if (!challenges) {
        const error = new Error("No challenges found!");
        error.code = 404;
        throw error;
      }
      return challenges;
    },
  },
  Challenge: {
    OQ: async function ({ challenge_id }, args, context) {
      const { OQLoader } = context;
      const OQ = OQLoader.load(challenge_id);
      if (!OQ) {
        const error = new Error("No OQ found!");
        error.code = 404;
        throw error;
      }
      return OQ;
    },
    ideas: async function ({ challenge_id }, args, context) {
        const { ideasLoader } = context;
        const ideas = ideasLoader.load(challenge_id);
        if (!ideas) {
          const error = new Error("No ideas found!");
          error.code = 404;
          throw error;
        }
        return ideas;
      },
  },
  Idea:{
      action: async function ({ idea_id }, args, context) {
        const {  actionsLoader } = context;
        const action =  actionsLoader.load(idea_id);
        if (!action) {
          const error = new Error("No action found!");
          error.code = 404;
          throw error;
        }
        return action ;
      },
  }
};
