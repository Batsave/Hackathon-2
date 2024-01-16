const AbstractManager = require("./AbstractManager");

class ForfaitManager extends AbstractManager {
  constructor() {
    super({ table: "forfait" });
  }

  // The C of CRUD - Create operation

  async create(forfait) {
    const [result] = await this.database.query(
      `insert into ${this.table} (forfait_info_id, massage_id)
             values (?, ?)`,
      [forfait.forfait_info_id, forfait.massage_id]
    );

    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async readWithID(id) {
    // Execute the SQL SELECT query to retrieve a specific item by its ID
    const [rows] = await this.database.query(
      `select *
             from ${this.table}
             where id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the item
    return rows;
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

  async update(id, updatedforfait) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET forfait_info_id=?
      massage_id=? WHERE id=? `,
      [updatedforfait.forfait_info_id, updatedforfait.massage_id, id]
    );
    return result;
  }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an item by its ID

  // async delete(id) {
  //   ...
  // }
}

module.exports = ForfaitManager;
