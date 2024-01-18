const AbstractManager = require("./AbstractManager");

class EmailsManager extends AbstractManager {
  constructor() {
    super({ table: "emails" });
  }

  async readAll() {
    const [rows] = await this.database.query(`SELECT * FROM ${this.table}`);
    return rows;
  }
}

module.exports = EmailsManager;
