const Challenge = require("../models/challenges");
const DataLoader = require("dataloader");
const { groupBy, map } = require("ramda");

const challengeLoader = new DataLoader(async (projectIds) => {
  const { rows: challenges } = await Challenge.fetchAll(projectIds);
  const groupedById = groupBy((challenge) => challenge.project_id, challenges);
  return map((projectId) => groupedById[projectId], projectIds);
});

const transformProject = async (project) => {
  const challenges = challengeLoader.load(project.project_id);
  return {
    ...project,
    challenges,
  };
};

exports.transformProject = transformProject;
