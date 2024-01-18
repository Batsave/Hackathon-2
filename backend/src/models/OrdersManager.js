const AbstractManager = require("./AbstractManager");

class OrdersManager extends AbstractManager {
  constructor() {
    super({ table: "orders" });
  }

  async readAll() {
    const [rows] = await this.database.query(`SELECT * FROM ${this.table}`);
    return rows;
  }

  async read(stylistId) {
    const [rows] = await this.database.query(
      `SELECT * FROM ${this.table} where stylistId=?`,
      [stylistId]
    );
    return rows;
  }

  async readWithSalonId(salonId) {
    const [rows] = await this.database.query(
      `SELECT * FROM ${this.table} where salonId=?`,
      [salonId]
    );
    return rows;
  }
}

module.exports = OrdersManager;
