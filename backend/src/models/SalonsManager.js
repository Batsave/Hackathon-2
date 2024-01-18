const AbstractManager = require("./AbstractManager");

class SalonsManager extends AbstractManager {
  constructor() {
    super({ table: "salons" });
  }

  async readAll() {
    const [rows] = await this.database.query(`SELECT * FROM ${this.table}`);
    return rows;
  }

  async readWithStylistId(stylistId) {
    const [results] = await this.database.query(
      `SELECT * FROM ${this.table} where stylistId=?`,
      [stylistId]
    );
    return results;
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing item

  async update(id, updatedSalons) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET salonName=?,
    city=?,
    country=?,
    WHERE id=? `,
      [
        updatedSalons.salonName.trim(),
        updatedSalons.city.trim(),
        updatedSalons.country.trim(),
        updatedSalons.salonId,
      ]
    );
    console.info(result);
    return result;
  }
}
module.exports = SalonsManager;
