const db = require("../util/database");

module.exports = class Challenge {
  constructor(id, name, projectId, challengeType) {
    this.id = id;
    this.name = name;
    this.projectId = projectId;
    this.challengeType= challengeType;
  }

  save() {
    return db.query(
      `INSERT INTO challenges(id, name, project_id, challenge_type)
      VALUES($1,$2,$3,$4)`,
      [this.id, this.name, this.projectId, this.challengeType ]
    );
  }

  static fetchAll(projectId) {
    return db.query(
        `SELECT 
        projects.id AS project_id, 
        projects.name AS project_name,
        challenges.id AS challenge_id,
        challenges.name AS challenge_name,
        challenge_type,
        challenges.is_selected AS challenge_is_selected
        FROM projects
        INNER JOIN challenges ON projects.id = challenges.project_id
        WHERE projects.id = $1`,
        [projectId]
        );
  }

  static findById(projectId, challengeId) {
    return db.query(
    `SELECT 
    projects.id AS project_id,
    projects.name AS project_name,
    challenges.id AS challenge_id,
    challenges.name AS challenge_name,
    challenge_type,
    challenges.is_selected AS challenge_is_selected
    FROM projects
    INNER JOIN challenges ON projects.id = challenges.project_id
    WHERE projects.id = $1 
    AND challenges.id = $2`, [projectId, challengeId]);
  }

// refactor to prevent unwanted injections
  static selectChallenges(selectedChallengesIds, project_id){
return db.query(
    `UPDATE challenges
    SET is_selected = CASE WHEN ${selectedChallengesIds} AND (project_id = $1) THEN true
                  ELSE false END`,[project_id])
  }

  static chosenChallenges (projectId){
      return db.query(
        `SELECT 
        projects.id AS project_id, 
        projects.name AS project_name,
        challenges.id AS challenge_id,
        challenges.name AS challenge_name,
        challenge_type,
        challenges.is_selected AS challenge_is_selected
        FROM projects
        INNER JOIN challenges ON projects.id = challenges.project_id
        WHERE projects.id = $1
        AND challenges.is_selected = TRUE`,[projectId])
  }



  static update(challengeId, challengeName) {
    return db.query(`UPDATE challenges
    SET name = $1
    WHERE id = $2
    `, [challengeName,challengeId]);
  }

  static delete(challengeId){
    return db.query("DELETE FROM challenges WHERE id = $1", [challengeId]);
  }
};