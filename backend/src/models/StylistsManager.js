const AbstractManager = require("./AbstractManager");

class StylistsManager extends AbstractManager {
  constructor() {
    super({ table: "stylists" });
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

  async create(country, firstName, lastName, stylistRole) {
    const [result] = await this.database.query(
      `INSERT INTO ${this.table} (country, firstName, lastName, stylistRole) values (?, ?, ?, ?)`,
      [country, firstName, lastName, stylistRole]
    );
    return result;
  }

  async update(country, firstName, lastName, stylistRole, optinValue) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET country = ?, firstname = ?, lastname = ?, stylistRole = ?, optinvalue = ?  WHERE id = ?`,
      [country, firstName, lastName, stylistRole, optinValue]
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
