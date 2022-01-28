const db = require("../util/database");

module.exports = class OQ {
  constructor(id, name, challengeId) {
    this.id = id;
    this.name = name;
    this.challengeId= challengeId;
  }

  save() {
    return db.query(
      `INSERT INTO opportunity_questions(id, name, challenge_id)
      VALUES($1,$2,$3)`,
      [this.id, this.name, this.challengeId]
    );
  }

  static fetchOQ(projectId, challengeId) {
    return db.query(`
    SELECT 
    projects.id AS project_id, 
    projects.name AS project_name,
    challenges.id AS challenge_id,
    challenges.name AS challenge_name,
    challenge_type,
    challenges.is_selected AS challenge_is_selected,
    opportunity_questions.id AS oq_id,
    opportunity_questions.name AS oq_name
    FROM projects
    INNER JOIN challenges ON projects.id = challenges.project_id
    INNER JOIN opportunity_questions ON challenges.id = opportunity_questions.challenge_id
    WHERE projects.id = $1
    AND challenges.id = $2`,
        [projectId, challengeId]
        );
  }

  static fetchAllOQ(challengeId) {
    return db.query(`
    SELECT 
    projects.id AS project_id, 
    projects.name AS project_name,
    challenges.id AS challenge_id,
    challenges.name AS challenge_name,
    challenge_type,
    challenges.is_selected AS challenge_is_selected,
    opportunity_questions.id AS oq_id,
    opportunity_questions.name AS oq_name
    FROM projects
    INNER JOIN challenges ON projects.id = challenges.project_id
    INNER JOIN opportunity_questions ON challenges.id = opportunity_questions.challenge_id
    WHERE challenges.id = ANY ($1)`,
        [challengeId]
        );
  }


  static update(oqId, oqName) {
    return db.query(`UPDATE opportunity_questions
    SET name = $1
    WHERE id = $2
    `, [oqName,oqId]);
  }

  static delete(oqId){
    return db.query("DELETE FROM opportunity_questions WHERE id = $1", [oqId]);
  }
};