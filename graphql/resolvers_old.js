const User = require("../models/users");
const Project = require("../models/projects");
const Challenge = require("../models/challenges");
const OQ = require("../models/OQ");
const Idea = require("../models/ideas");
const Action = require("../models/actions");
const bcrypt = require("bcryptjs");
const { extractedIds } = require("../util/extractedIds");
const validator = require("validator");
const { transformProject } = require("../graphql/merge");

module.exports = {
  createUser: async function ({ createUserInput }, req) {
    const { user_id, email, password } = createUserInput;

    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: "E-Mail is invalid!" });
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      errors.push({ message: "Password too short!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input!");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findByEmail(email);

    if (existingUser.rowCount === 1) {
      const error = new Error("User exists already!");
      throw error;
    }
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User(user_id, email, hashedPw);

    const savedUser = await user.save();

    return { message: "User added succesfully." };
  },
  users: async function (req) {
    const { rows: users } = await User.fetchAll();
    if (users.length === 0) {
      const error = new Error("No users found!");
      error.code = 404;
      throw error;
    }
    return users;
  },
  deleteUser: async function ({ user_id }, req) {
    const deletedUser = await User.delete(user_id);

    if (deletedUser.rowCount === 1) {
      return { message: "User deleted succesfully." };
    } else {
      const error = new Error("Invalid input!");
      error.code = 422;
      throw error;
    }
  },
  createProject: async function ({ createProjectInput }, req) {
    const { project_id, project_name, user_id } = createProjectInput;

    const errors = [];

    if (validator.isEmpty(project_name.trim())) {
      errors.push({ message: "Project name must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input!");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const project = new Project(project_id, project_name, user_id);

    const savedProject = await project.save();

    return { message: "Project created succesfully." };
  },

  project: async function ({ project_id }, req) {
    const { rows: project } = await Project.findById(project_id);

    if (project.length === 0) {
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
    if (projects.length === 0) {
      const error = new Error("No project found!");
      error.code = 404;
      throw error;
    }
    return projects.map((project) => {
      return transformProject(project);
    });
  },

  updateProject: async function ({ project_id, project_name }, req) {
    const errors = [];
    if (validator.isEmpty(project_name.trim())) {
      errors.push({ message: "Project name must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input!");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const updatedProject = await Project.update(project_id, project_name);

    if (updatedProject.rowCount === 1) {
      return { message: "Project updated succesfully." };
    } else {
      const error = new Error("Invalid input!");
      error.code = 422;
      throw error;
    }
  },

  deleteProject: async function ({ project_id }, req) {
    const deletedProject = await Project.delete(project_id);

    if (deletedProject.rowCount === 1) {
      return { message: "Project deleted succesfully." };
    } else {
      const error = new Error("Invalid input!");
      error.code = 422;
      throw error;
    }
  },
  createChallenge: async function ({ createChallengeInput }, req) {
    const { challenge_id, challenge_name, project_id, challenge_type } =
      createChallengeInput;
    const errors = [];
    if (validator.isEmpty(challenge_name.trim())) {
      errors.push({ message: "Challenge name must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input!");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const challenge = new Challenge(
      challenge_id,
      challenge_name,
      project_id,
      challenge_type
    );

    const createdChallenge = await challenge.save();

    return { message: "Challenge created succesfully." };
  },
  challenges: async function ({ project_id }, req) {
    const { rows: challenges } = await Challenge.fetchAll(project_id);
    if (challenges.length === 0) {
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
    if (challenge.length === 0) {
      const error = new Error("No challenge found!");
      error.code = 404;
      throw error;
    }
    return {
      ...challenge[0],
    };
  },

  selectChallenges: async function ({ selectedIds, project_id }, req) {
    const receivedIds = extractedIds(selectedIds);
    const updatedChallenges = await Challenge.selectChallenges(
      receivedIds,
      project_id
    );
    // refactor to handle error properly
    if (updatedChallenges.rowCount > 0) {
      return { message: "Challenges selected succesfully." };
    } else {
      const error = new Error("Invalid input!");
      error.code = 422;
      throw error;
    }
  },
  chosenChallenges: async function ({ project_id }, req) {
    const { rows: challenges } = await Challenge.chosenChallenges(project_id);
    if (challenges.length === 0) {
      const error = new Error("No challenge found!");
      error.code = 404;
      throw error;
    }

    return challenges;
  },

  updateChallenge: async function ({ challenge_id, challenge_name }, req) {
    const errors = [];
    if (validator.isEmpty(challenge_name.trim())) {
      errors.push({ message: "Challenge name must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input!");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const updatedChallenge = await Challenge.update(
      challenge_id,
      challenge_name
    );

    if (updatedChallenge.rowCount === 1) {
      return { message: "Challenge update succesfully." };
    } else {
      const error = new Error("Invalid input!");
      error.code = 422;
      throw error;
    }
  },

  deleteChallenge: async function ({ challenge_id }, req) {
    const updatedChallenge = await Challenge.delete(challenge_id);

    if (updatedChallenge.rowCount === 1) {
      return { message: "Challenge deleted succesfully." };
    } else {
      const error = new Error("Invalid input!");
      error.code = 422;
      throw error;
    }
  },
  createOQ: async function ({ challenge_id, oq_id, oq_name }, req) {
    const errors = [];
    if (validator.isEmpty(oq_name.trim())) {
      errors.push({ message: "OQ name must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input!");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const oq = new OQ(oq_id, oq_name, challenge_id);

    const createdOQ = await oq.save();

    return { message: "OQ created succesfully." };
  },
  oq: async function ({ project_id, challenge_id }, req) {
    const { rows: oq } = await OQ.fetchOQ(project_id, challenge_id);
    if (!oq) {
      const error = new Error("No OQ found!");
      error.code = 404;
      throw error;
    }
    return {
      ...oq[0],
    };
  },
  updateOQ: async function ({ oq_id, oq_name }, req) {
    const errors = [];
    if (validator.isEmpty(oq_name.trim())) {
      errors.push({ message: "OQ name must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input!");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const updatedOQ = await OQ.update(oq_id, oq_name);

    if (updatedOQ.rowCount === 1) {
      return { message: "OQ updated succesfully." };
    } else {
      const error = new Error("Invalid input!");
      error.code = 422;
      throw error;
    }
  },
  deleteOQ: async function ({ oq_id }, req) {
    const updatedOQ = await OQ.delete(oq_id);

    if (updatedOQ.rowCount === 1) {
      return { message: "OQ deleted succesfully." };
    } else {
      const error = new Error("Invalid input!");
      error.code = 422;
      throw error;
    }
  },
  createIdea: async function ({ challenge_id, idea_id, idea_name }, req) {
    const errors = [];
    if (validator.isEmpty(idea_name.trim())) {
      errors.push({ message: "Idea name must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input!");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const idea = new Idea(idea_id, idea_name, challenge_id);

    const createdIdea = await idea.save();

    return { message: "Idea created succesfully." };
  },
  ideas: async function ({ project_id, challenge_id }, req) {
    const { rows: ideas } = await Idea.fetchAll(project_id, challenge_id);
    if (ideas.length === 0) {
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
    if (idea.length === 0) {
      const error = new Error("No idea found!");
      error.code = 404;
      throw error;
    }
    return {
      ...idea[0],
    };
  },

  selectIdeas: async function ({ selectedIds, challenge_id }, req) {
    const receivedIds = extractedIds(selectedIds);
    // refactor to handle error properly
    const updatedChallenges = await Idea.selectIdeas(receivedIds, challenge_id);
    if (updatedChallenges.rowCount > 0) {
      return { message: "Ideas selected succesfully." };
    } else {
      const error = new Error("Invalid input!");
      error.code = 422;
      throw error;
    }
  },
  chosenIdeas: async function ({ project_id, challenge_id }, req) {
    const { rows: ideas } = await Idea.chosenIdeas(project_id, challenge_id);
    if (ideas.length === 0) {
      const error = new Error("No ideas found!");
      error.code = 404;
      throw error;
    }

    return ideas;
  },

  updateIdea: async function ({ idea_id, idea_name }, req) {
    const errors = [];

    if (validator.isEmpty(idea_name.trim())) {
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
      return { message: "Idea updated succesfully." };
    } else {
      const error = new Error("Invalid input!");
      error.code = 422;
      throw error;
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
      return { message: "Idea updated succesfully." };
    } else {
      const error = new Error("Invalid input!");
      error.code = 422;
      throw error;
    }
  },

  deleteIdea: async function ({ idea_id }, req) {
    const updatedIdea = await Idea.delete(idea_id);

    if (updatedIdea.rowCount === 1) {
      return { message: "Idea deleted succesfully." };
    } else {
      const error = new Error("Invalid input!");
      error.code = 422;
      throw error;
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

    const errors = [];
    if (validator.isEmpty(action_what.trim())) {
      errors.push({
        message: "Action 'What need to be donde..' must not be empty!",
      });
    }
    if (!validator.isAfter(action_due_date)) {
      errors.push({ message: "Action due date must be later than today!" });
    }
    if (!validator.isAfter(action_test_until, action_due_date)) {
      errors.push({ message: "Action test date must be later than due date!" });
    }
    if (validator.isEmpty(action_succes_criteria.trim())) {
      errors.push({ message: "Action 'Succes criteria' must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input!");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const action = new Action(
      action_id,
      action_what,
      action_due_date,
      action_test_until,
      action_succes_criteria,
      idea_id
    );

    const createdAction = await action.save();

    return { message: "Action created succesfully." };
  },
  actions: async function ({ user_id }, req) {
    const { rows: actions } = await Action.fetchAll(user_id);
    if (actions.length === 0) {
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
    if (action.length === 0) {
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
      action_id,
      action_what,
      action_due_date,
      action_test_until,
      action_succes_criteria,
    } = updateActionInput;

    const errors = [];
    if (validator.isEmpty(action_what.trim())) {
      errors.push({
        message: "Action 'What need to be donde..' must not be empty!",
      });
    }
    if (!validator.isAfter(action_due_date)) {
      errors.push({ message: "Action due date must be later than today!" });
    }
    if (!validator.isAfter(action_test_until, action_due_date)) {
      errors.push({ message: "Action test date must be later than due date!" });
    }
    if (validator.isEmpty(action_succes_criteria.trim())) {
      errors.push({ message: "Action 'Succes criteria' must not be empty!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input!");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const updatedAction = await Action.update(
      action_what,
      action_due_date,
      action_test_until,
      action_succes_criteria,
      action_id
    );

    if (updatedAction.rowCount === 1) {
      return { message: "Action updated succesfully." };
    } else {
      const error = new Error("Invalid input!");
      error.code = 422;
      throw error;
    }
  },

  deleteAction: async function ({ action_id }, req) {
    const deletedAction = await Action.delete(action_id);

    if (deletedAction.rowCount === 1) {
      return { message: "Action deleted succesfully." };
    } else {
      const error = new Error("Invalid input!");
      error.code = 422;
      throw error;
    }
  },
};
