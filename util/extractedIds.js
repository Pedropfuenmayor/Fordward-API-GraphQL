
exports.extractedIds = (challengesIds) => {
  let challengesIdsString = "";

  for (let i = 0; i < challengesIds.length; i++) {
    if (i !== challengesIds.length - 1) {
      challengesIdsString += ` (id=${challengesIds[i]}) OR`;
    } else {
      challengesIdsString += ` (id=${challengesIds[i]})`;
    }
  }
  return challengesIdsString;
};

