const AbstractManager = require("./AbstractManager");

class MassageManager extends AbstractManager {
  constructor() {
    super({ table: "massage" });
  }

  // The C of CRUD - Create operation

  async create(massage) {
    const [result] = await this.database.query(
      `insert into ${this.table} (nom)
             values (?)`,
      [massage.nom]
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

    // Return the first row of the result, which represents the item
    return rows[0];
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all items from the "item" table
    const [rows] = await this.database.query(`select *
                                                  from ${this.table}`);

    // Return the array of items
    return rows;
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing item

  async update(id, updatedMassage) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET nom=? WHERE id=? `,
      [updatedMassage.nom, id]
    );
    console.info(result);
    return result;
  }

  async massageCheck(nom) {
    const [massage] = await this.database.query(
      `SELECT * FROM massage WHERE nom = ?`,
      [nom]
    );
    return massage;
  }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an item by its ID

  // async delete(id) {
  //   ...
  // }
}

module.exports = MassageManager;
