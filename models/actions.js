const db = require("../util/database");

module.exports = class Action {
  constructor(id, what, dueDate, testUntil, succesCriteria, ideaId) {
    this.id = id;
    this.what = what;
    this.dueDate = dueDate;
    this.testUntil = testUntil;
    this.succesCriteria = succesCriteria;
    this.ideaId = ideaId;
  }

  save() {
    return db.query(
      `INSERT INTO actions (id, what, due_date, test_until, succes_criteria, idea_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [this.id, this.what, this.dueDate, this.testUntil, this.succesCriteria, this.ideaId]
    );
  }

  static fetchAll(userId) {
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
      ideas.effort AS idea_effort,
      actions.id AS action_id,
      actions.what AS action_what,
      actions.due_date AS action_due_date,
      actions.test_until AS action_test_until,
      actions.succes_criteria AS action_succes_criteria
      FROM projects
      INNER JOIN challenges ON projects.id = challenges.project_id
      INNER JOIN opportunity_questions ON challenges.id = opportunity_questions.challenge_id
      INNER JOIN ideas ON challenges.id = ideas.challenge_id
      INNER JOIN actions ON ideas.id = actions.idea_id
      WHERE projects.user_id = $1
      `,
      [userId]
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
      ideas.effort AS idea_effort,
      actions.id AS action_id,
      actions.what AS action_what,
      actions.due_date AS action_due_date,
      actions.test_until AS action_test_until,
      actions.succes_criteria AS action_succes_criteria
      FROM projects
      INNER JOIN challenges ON projects.id = challenges.project_id
      INNER JOIN opportunity_questions ON challenges.id = opportunity_questions.challenge_id
      INNER JOIN ideas ON challenges.id = ideas.challenge_id
      INNER JOIN actions ON ideas.id = actions.idea_id
      WHERE projects.id = $1
      AND challenges.id = $2
      AND ideas.id = $3
    `,
      [projectId, challengeId, ideaId]
    );
  }

  static update(what, dueDate, testUntil, succesCriteria, actionId) {
    return db.query(
      `UPDATE actions
    SET what = $1, due_date = $2, test_until = $3, succes_criteria = $4
    WHERE id = $5
    `,
      [what, dueDate, testUntil, succesCriteria, actionId]
    );
  }

  static delete(actionId) {
    return db.query("DELETE FROM actions WHERE id = $1", [actionId]);
  }
};