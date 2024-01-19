const AbstractManager = require("./AbstractManager");

class TypePaiementManager extends AbstractManager {
  constructor() {
    super({ table: "type_paiement" });
  }

  // The C of CRUD - Create operation

  async create(type) {
    const [result] = await this.database.query(
      `insert into ${this.table} (nom)
             values (?)`,
      [type.nom.trim()]
    );

    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific item by its ID
    const [rows] = await this.database.query(
      `select *
             from ${this.table}
             where id = ?`,
      [id]
    );
    return rows[0];
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all items from the "item" table
    const [rows] = await this.database.query(`select *
                                                  from ${this.table}`);
    return rows;
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing item

  async update(id, nom) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET 
      nom=?
      WHERE id=? `,
      [nom.trim(), id]
    );
    return result;
  }

  // The D of CRUD - Delete operation
  async delete(id) {
    const [result] = await this.database.query(
      `DELETE
             FROM client
             WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = TypePaiementManager;
