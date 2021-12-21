const Project = require("../models/projects");
const Challenge = require("../models/challenges");
const OQ = require("../models/OQ");
const Idea = require("../models/ideas");
const Action = require("../models/actions");
const { extractedIds } = require("../util/extractedIds");
const validator = require("validator");

module.exports = {
  createProject: async function ({ createProjectInput }, req) {
    const errors = [];
    if (validator.isEmpty(createProjectInput.name)) {
      errors.push({ message: "Project name must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const { id, name, user_id } = createProjectInput;
    const project = new Project(id, name, user_id);

    await project.save();

    return true;
  },

  project: async function ({ id }, req) {
    const { rows: project } = await Project.findById(id);
    if (!project) {
      const error = new Error("No project found!");
      error.code = 404;
      throw error;
    }
    return {
      ...project[0],
    };
  },

  projects: async function ({ user_id }, req) {
    const { rows: projects } = await Project.fetchAll(user_id);
    if (!projects) {
      const error = new Error("No project found!");
      error.code = 404;
      throw error;
    }
    return projects;
  },

  updateProject: async function ({ id, name }, req) {
    const errors = [];
    if (validator.isEmpty(name)) {
      errors.push({ message: "Project name must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const updatedProject = await Project.update(id, name);

    if (updatedProject.rowCount === 1) {
      return true;
    } else {
      return false;
    }
  },

  deleteProject: async function ({ id }, req) {
    const deletedProject = await Project.delete(id);

    if (deletedProject.rowCount === 1) {
      return true;
    } else {
      return false;
    }
  },
  createChallenge: async function ({ createChallengeInput }, req) {
    const errors = [];
    if (validator.isEmpty(createChallengeInput.challenge_name)) {
      errors.push({ message: "Challenge name must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const { challenge_id, challenge_name, project_id, challenge_type } =
      createChallengeInput;
    const challenge = new Challenge(
      challenge_id,
      challenge_name,
      project_id,
      challenge_type
    );

    await challenge.save();

    return true;
  },
  challenges: async function ({ project_id }, req) {
    const { rows: challenges } = await Challenge.fetchAll(project_id);
    if (!challenges) {
      const error = new Error("No challenge found!");
      error.code = 404;
      throw error;
    }

    return challenges;
  },
  challenge: async function ({ project_id, challenge_id }, req) {
    const { rows: challenge } = await Challenge.findById(
      project_id,
      challenge_id
    );
    if (!challenge) {
      const error = new Error("No challenge found!");
      error.code = 404;
      throw error;
    }
    return {
      ...challenge[0],
    };
  },

  selectChallenges: async function ({ selectedIds }, req) {
    const receivedIds = extractedIds(selectedIds);
    const updatedChallenges = await Challenge.selectChallenges(receivedIds);
    if (updatedChallenges.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  },
  chosenChallenges: async function ({ project_id }, req) {
    const { rows: challenges } = await Challenge.chosenChallenges(project_id);
    if (!challenges) {
      const error = new Error("No challenge found!");
      error.code = 404;
      throw error;
    }

    return challenges;
  },

  updateChallenge: async function ({ challenge_id, challenge_name }, req) {
    const errors = [];
    if (validator.isEmpty(challenge_name)) {
      errors.push({ message: "Challenge name must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const updatedChallenge = await Challenge.update(
      challenge_id,
      challenge_name
    );

    if (updatedChallenge.rowCount === 1) {
      return true;
    } else {
      return false;
    }
  },

  deleteChallenge: async function ({ challenge_id }, req) {
    const updatedChallenge = await Challenge.delete(challenge_id);

    if (updatedChallenge.rowCount === 1) {
      return true;
    } else {
      return false;
    }
  },
  createOQ: async function ({ challenge_id, oq_id, oq_name }, req) {
    const errors = [];
    if (validator.isEmpty(oq_name)) {
      errors.push({ message: "OQ name must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const oq = new OQ(oq_id, oq_name, challenge_id);

    await oq.save();

    return true;
  },
  oq: async function ({ project_id, challenge_id }, req) {
    const { rows: oq } = await OQ.fetchOQ(project_id, challenge_id);
    if (!oq) {
      const error = new Error("No oq found!");
      error.code = 404;
      throw error;
    }
    return {
      ...oq[0],
    };
  },
  updateOQ: async function ({ oq_id, oq_name }, req) {
    const errors = [];
    if (validator.isEmpty(oq_name)) {
      errors.push({ message: "OQ name must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const updatedOQ = await OQ.update(oq_id, oq_name);

    if (updatedOQ.rowCount === 1) {
      return true;
    } else {
      return false;
    }
  },
  deleteOQ: async function ({ oq_id }, req) {
    const updatedOQ = await OQ.delete(oq_id);

    if (updatedOQ.rowCount === 1) {
      return true;
    } else {
      return false;
    }
  },
  createIdea: async function ({ challenge_id, idea_id, idea_name }, req) {
    const errors = [];
    if (validator.isEmpty(idea_name)) {
      errors.push({ message: "Idea name must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const idea = new Idea(idea_id, idea_name, challenge_id);

    await idea.save();

    return true;
  },
  ideas: async function ({ project_id, challenge_id }, req) {
    const { rows: ideas } = await Idea.fetchAll(project_id, challenge_id);
    if (!ideas) {
      const error = new Error("No ideas found!");
      error.code = 404;
      throw error;
    }

    return ideas;
  },
  idea: async function ({ project_id, challenge_id, idea_id }, req) {
    const { rows: idea } = await Idea.findById(
      project_id,
      challenge_id,
      idea_id
    );
    if (!idea) {
      const error = new Error("No idea found!");
      error.code = 404;
      throw error;
    }
    return {
      ...idea[0],
    };
  },

  selectIdeas: async function ({ selectedIds }, req) {
    const receivedIds = extractedIds(selectedIds);
    const updatedChallenges = await Idea.selectIdeas(receivedIds);
    if (updatedChallenges.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  },
  chosenIdeas: async function ({ project_id, challenge_id }, req) {
    const { rows: ideas } = await Idea.chosenIdeas(project_id, challenge_id);
    if (!ideas) {
      const error = new Error("No ideas found!");
      error.code = 404;
      throw error;
    }

    return ideas;
  },

  updateIdea: async function ({ idea_id, idea_name }, req) {
    const errors = [];

    if (validator.isEmpty(idea_name)) {
      errors.push({ message: "Idea name must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const updatedIdea = await Idea.update(idea_id, idea_name);

    if (updatedIdea.rowCount === 1) {
      return true;
    } else {
      return false;
    }
  },

  updateIdeaImpactEffort: async function (
    { idea_id, idea_impact_effort, impact_effort_value },
    req
  ) {
    const updatedIdea = await Idea.updateImpactEffort(
      idea_id,
      impact_effort_value,
      idea_impact_effort
    );

    if (updatedIdea.rowCount === 1) {
      return true;
    } else {
      return false;
    }
  },

  deleteIdea: async function ({ idea_id }, req) {
    const updatedIdea = await Idea.delete(idea_id);

    if (updatedIdea.rowCount === 1) {
      return true;
    } else {
      return false;
    }
  },
  createAction: async function ({ createActionInput }, req) {
    const {
      action_id,
      action_what,
      action_due_date,
      action_test_until,
      action_succes_criteria,
      idea_id,
    } = createActionInput;
    const action = new Action(
      action_id,
      action_what,
      action_due_date,
      action_test_until,
      action_succes_criteria,
      idea_id
    );

    await action.save();

    return true;
  },
  actions: async function ({ user_id }, req) {
    const { rows: actions } = await Action.fetchAll(user_id);
    if (!actions) {
      const error = new Error("No Actions found!");
      error.code = 404;
      throw error;
    }

    return actions;
  },
  action: async function ({ project_id, challenge_id, idea_id }, req) {
    const { rows: action } = await Action.findById(
      project_id,
      challenge_id,
      idea_id
    );
    if (!action) {
      const error = new Error("No action found!");
      error.code = 404;
      throw error;
    }
    return {
      ...action[0],
    };
  },

  updateAction: async function ({ updateActionInput }, req) {
    const {
      action_what,
      action_due_date,
      action_test_until,
      action_succes_criteria,
      idea_id,
    } = updateActionInput;

    const updatedAction = await Action.update(
      action_what,
      action_due_date,
      action_test_until,
      action_succes_criteria,
      idea_id
    );

    if (updatedAction .rowCount === 1) {
      return true;
    } else {
      return false;
    }
  },

  deleteIdea: async function ({ idea_id }, req) {
    const updatedIdea = await Idea.delete(idea_id);

    if (updatedIdea.rowCount === 1) {
      return true;
    } else {
      return false;
    }
  },
};
