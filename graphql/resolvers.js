const Project = require("../models/projects");

module.exports = {
  createProject: async function ({ projectInput }, req) {
    //   const email = args.userInput.email;
    const {id, name, user_id} = projectInput
    const project = new Project(id, name, user_id);

    await project.save();
    
    return { ...project};
  },

  project: async function({ id }, req) {
    const {rows:project} = await Project.findById(id)
    if (!project) {
      const error = new Error('No project found!');
      error.code = 404;
      throw error;
    }
    return {
     ...project[0]
    };
  },

  projects: async function({ user_id }, req) {
    const {rows:projects} = await Project.fetchAll(user_id)
    if (!projects) {
      const error = new Error('No project found!');
      error.code = 404;
      throw error;
    }
    return projects;
  }
};
