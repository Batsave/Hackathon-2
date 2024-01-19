const AbstractManager = require("./AbstractManager");

class StylistsManager extends AbstractManager {
  constructor() {
    super({ table: "stylists" });
  }

  async readAll() {
    const [rows] = await this.database.query(`SELECT * FROM ${this.table}`);
    return rows;
  }

  async readWithId(stylistId) {
    const [rows] = await this.database.query(
      `SELECT * from ${this.table} WHERE stylistId = ?`,
      [stylistId]
    );
    return rows;
  }

  async create(country, firstName, lastName, stylistRole) {
    const [result] = await this.database.query(
      `INSERT INTO ${this.table} (country, firstName, lastName, stylistRole) values (?, ?, ?, ?)`,
      [country, firstName, lastName, stylistRole]
    );
    return result;
  }

  async update(firstName, lastName, stylistRole, optinValue, stylistId) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET firstName = ?, lastName = ?, stylistRole = ?, optinValue = ?  WHERE stylistId = ?`,
      [firstName, lastName, stylistRole, optinValue, stylistId]
    );
    return result.affectedRows;
  }

  async destroy(id) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = StylistsManager;
