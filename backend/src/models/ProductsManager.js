const AbstractManager = require("./AbstractManager");

class ProductsManager extends AbstractManager {
  constructor() {
    super({ table: "products" });
  }

  async readAll() {
    const [rows] = await this.database.query(
      `SELECT * FROM ${this.table} LIMIT 50`
    );
    return rows;
  }

  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific products by its ID
    const [rows] = await this.database.query(
      `SELECT *
             FROM ${this.table}
             WHERE id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the products
    return rows[0];
  }
}
module.exports = ProductsManager;
