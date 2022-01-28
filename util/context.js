const Challenge = require("../models/challenges");
const OQ = require("../models/OQ");
const Idea = require("../models/ideas")
const Action = require("../models/actions")
const DataLoader = require("dataloader");
const { groupBy, map } = require("ramda");


const challengeLoader = new DataLoader(async (projectIds) => {
  const { rows: challenges } = await Challenge.fetchAll(projectIds);
  const groupedById = groupBy((challenge) => challenge.project_id, challenges);
  return map((projectId) => groupedById[projectId], projectIds);
});

const OQLoader = new DataLoader(async (challengeIds) => {
  const { rows: OQs } = await OQ.fetchAllOQ(challengeIds);
  const groupedById = groupBy((OQ) => OQ.challenge_id, OQs);
  const finalArray = map((challengeId) => {
    const OQobject = groupedById[challengeId];
    if (OQobject) {
      return OQobject[0];
    } else {
      return null;
    }
  }, challengeIds);
  return finalArray;
});

const ideasLoader = new DataLoader(async (challengeIds) => {
    const { rows: ideas } = await Idea.fetchAllIdeas(challengeIds);
    const groupedById = groupBy((idea) => idea.challenge_id, ideas);
    return map((challengeId) => groupedById[challengeId], challengeIds);
  });

  const actionsLoader = new DataLoader(async (ideasIds) => {
    const { rows: actions } = await Action.fetchAllActions(ideasIds);
    const groupedById = groupBy((action) => action.idea_id, actions);
    const finalArray = map((ideaId) => {
      const actionObject = groupedById[ideaId];
      if (actionObject) {
        return actionObject[0];
      } else {
        return null;
      }
    }, ideasIds);
    return finalArray;
  });

const loaders = ()=>({
    challengeLoader,
    OQLoader,
    ideasLoader,
    actionsLoader
})

module.exports = loaders