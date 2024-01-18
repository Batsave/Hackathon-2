const AbstractManager = require("./AbstractManager");

class OrderLinesManager extends AbstractManager {
  constructor() {
    super({ table: "orderlines" });
  }

  async readAll() {
    const [rows] = await this.database.query(`SELECT * FROM ${this.table}`);
    return rows;
  }

  async readWithId(id) {
    const [rows] = await this.database.query(
      `SELECT * from ${this.table} WHERE id = ?`,
      [id]
    );
    return rows[0];
  }
}

module.exports = OrderLinesManager;
