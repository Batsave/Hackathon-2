const AbstractManager = require("./AbstractManager");

class SalonsManager extends AbstractManager {
  constructor() {
    super({ table: "salons" });
  }

  async readAll() {
    const [rows] = await this.database.query(`SELECT * FROM ${this.table}`);
    return rows;
  }
}
module.exports = SalonsManager;
