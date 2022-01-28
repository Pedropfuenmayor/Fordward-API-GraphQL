const db = require("../util/database");

module.exports = class Idea {
  constructor(id, name, challengeId) {
    this.id = id;
    this.name = name;
    this.challengeId = challengeId;
  }

  save() {
    return db.query(
      `INSERT INTO ideas(id, name, challenge_id)
      VALUES($1,$2,$3)`,
      [this.id, this.name, this.challengeId]
    );
  }

  static fetchAll(projectId, challengeId) {
    return db.query(
      `SELECT 
    projects.id AS project_id, 
    projects.name AS project_name,
    challenges.id AS challenge_id,
    challenges.name AS challenge_name,
    opportunity_questions.id AS opportunity_question_id,
    opportunity_questions.name AS opportunity_question_name,
    ideas.id AS idea_id,
    ideas.name AS idea_name,
    ideas.is_selected AS idea_is_selected,
    ideas.impact AS idea_impact,
    ideas.effort AS idea_effort
    FROM projects
    INNER JOIN challenges ON projects.id = challenges.project_id
    INNER JOIN opportunity_questions ON challenges.id = opportunity_questions.challenge_id
    JOIN ideas ON challenges.id = ideas.challenge_id
    WHERE projects.id = $1
    AND challenges.id = $2`,
      [projectId, challengeId]
    );
  }

  static fetchAllIdeas(challengeId) {
    return db.query(
      `SELECT 
    projects.id AS project_id, 
    projects.name AS project_name,
    challenges.id AS challenge_id,
    challenges.name AS challenge_name,
    opportunity_questions.id AS opportunity_question_id,
    opportunity_questions.name AS opportunity_question_name,
    ideas.id AS idea_id,
    ideas.name AS idea_name,
    ideas.is_selected AS idea_is_selected,
    ideas.impact AS idea_impact,
    ideas.effort AS idea_effort
    FROM projects
    INNER JOIN challenges ON projects.id = challenges.project_id
    INNER JOIN opportunity_questions ON challenges.id = opportunity_questions.challenge_id
    JOIN ideas ON challenges.id = ideas.challenge_id
    WHERE challenges.id = ANY ($1)`,
      [challengeId]
    );
  }

  static findById(projectId, challengeId, ideaId) {
    return db.query(
      `SELECT 
    projects.id AS project_id, 
    projects.name AS project_name,
    challenges.id AS challenge_id,
    challenges.name AS challenge_name,
    opportunity_questions.id AS opportunity_question_id,
    opportunity_questions.name AS opportunity_question_name,
    ideas.id AS idea_id,
    ideas.name AS idea_name,
    ideas.is_selected AS idea_is_selected,
    ideas.impact AS idea_impact,
    ideas.effort AS idea_effort
    FROM projects
    INNER JOIN challenges ON projects.id = challenges.project_id
    INNER JOIN opportunity_questions ON challenges.id = opportunity_questions.challenge_id
    JOIN ideas ON challenges.id = ideas.challenge_id
    WHERE projects.id = $1
    AND challenges.id = $2
    AND ideas.id = $3
    `,
      [projectId, challengeId, ideaId]
    );
  }

  static update(ideaId, ideaName) {
    return db.query(
      `UPDATE ideas
    SET name = $1
    WHERE id = $2
    `,
      [ideaName, ideaId]
    );
  }
//refactor to prevent unwanted injections
  static selectIdeas(selectedideasIds, challenge_id) {
    return db.query(
      `UPDATE ideas
        SET is_selected = CASE WHEN ${selectedideasIds} AND challenge_id = $1 THEN true
                      ELSE false END`, [challenge_id]
    );
  }

  static chosenIdeas(projectId, challengeId) {
    return db.query(
      `SELECT 
        projects.id AS project_id, 
        projects.name AS project_name,
        challenges.id AS challenge_id,
        challenges.name AS challenge_name,
        opportunity_questions.id AS opportunity_question_id,
        opportunity_questions.name AS opportunity_question_name,
        ideas.id AS idea_id,
        ideas.name AS idea_name,
        ideas.is_selected AS idea_is_selected,
        ideas.impact AS idea_impact,
        ideas.effort AS idea_effort
        FROM projects
        INNER JOIN challenges ON projects.id = challenges.project_id
        INNER JOIN opportunity_questions ON challenges.id = opportunity_questions.challenge_id
        JOIN ideas ON challenges.id = ideas.challenge_id
        WHERE projects.id = $1
        AND challenges.id = $2
        AND ideas.is_selected = TRUE
        `,
      [projectId, challengeId]
    );
  }

  static updateImpactEffort(ideaId, impactEffortValue, ideaImpactEffort) {
    return db.query(
      `UPDATE ideas
    SET ${ideaImpactEffort} = $1
    WHERE id = $2
    `,
      [impactEffortValue, ideaId]
    );
  }

  static delete(ideaId) {
    return db.query("DELETE FROM ideas WHERE id = $1", [ideaId]);
  }
};
