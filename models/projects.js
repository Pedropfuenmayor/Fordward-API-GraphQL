const db = require("../util/database");

module.exports = class Project {
  constructor(id, name, userId) {
    this.id = id;
    this.name = name;
    this.userId = userId;
  }

  save() {
    return db.query(
      `INSERT INTO projects(id, name, user_id)
      VALUES($1,$2,$3)`,
      [this.id, this.name, this.userId]
    );
  }

  static fetchAll(user_id) {
    return db.query(`SELECT 
    id AS project_id,
    name AS project_name,
    user_id 
    FROM projects WHERE user_id = $1`, [user_id]);
  }

  static findById(projectId) {
    return db.query(`SELECT 
    id AS project_id,
    name AS project_name,
    user_id 
    FROM projects WHERE id = $1`, [projectId]);
  }

  static update(projectId, projectName) {
    return db.query(`UPDATE projects 
    SET name = $1
    WHERE id = $2
    `, [projectName,projectId]);
  }

  static delete(projectId){
    return db.query("DELETE FROM projects WHERE id = $1", [projectId]);
  }
};