const db = require("../util/database");

module.exports = class User {
  constructor(id, email, password) {
    this.id = id;
    this.email = email;
    this.password = password;
  }

  save(){
    return db.query(
      `INSERT INTO users(id, email, password)
      VALUES($1,$2,$3)`,
      [this.id, this.email, this.password]
    );
  }

  static fetchAll() {
    return db.query(`SELECT 
    id as user_id,
    email,
    password
    FROM users`);
  }

  static findByEmail(email) {
    return db.query("SELECT * FROM users WHERE email = $1", [email]);
  }

  static delete(userId){
    return db.query("DELETE FROM users WHERE id = $1", [userId]);
  }

};
