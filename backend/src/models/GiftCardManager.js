const AbstractManager = require("./AbstractManager");

class GiftcardManager extends AbstractManager {
  constructor() {
    super({ table: "carte_cadeau" });
  }

  // The C of CRUD - Create operation

  async create(carteCadeau) {
    const [result] = await this.database.query(
      `insert into ${this.table} (client_id, massage_id, forfait_id, montant, paiementType, acheteur_id, date_achat, date_expiration, utilise)
             values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        carteCadeau.client_id,
        carteCadeau.massage_id,
        carteCadeau.forfait_id,
        carteCadeau.montant,
        carteCadeau.paiementType,
        carteCadeau.acheteur_id,
        carteCadeau.date_achat,
        carteCadeau.date_expiration,
        carteCadeau.utilise,
      ]
    );

    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async readWithClientID(id) {
    // Execute the SQL SELECT query to retrieve a specific item by its ID
    const [rows] = await this.database.query(
      `select *
             from ${this.table}
             where client_id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the item
    return rows;
  }

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

  async update(id, updatedCarteCadeau) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET client_id=?,
      massage_id=?,
      forfait_id=?,
      montant=?,
      paiementType=?,
      acheteur_id=?,
      utilise=? WHERE id=? `,
      [
        updatedCarteCadeau.client_id,
        updatedCarteCadeau.massage_id,
        updatedCarteCadeau.forfait_id,
        updatedCarteCadeau.montant,
        updatedCarteCadeau.paiementType,
        updatedCarteCadeau.acheteur_id,
        updatedCarteCadeau.utilise,
        id,
      ]
    );
    return result;
  }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an item by its ID

  async deleteWithClientId(ClientId) {
    const [result] = await this.database.query(
      `DELETE
             FROM carte_cadeau
             WHERE client_id = ?`,
      [ClientId]
    );
    return result;
  }

  async deleteWithId(Id) {
    const [result] = await this.database.query(
      `DELETE
             FROM carte_cadeau
             WHERE id = ?`,
      [Id]
    );
    return result;
  }
}

module.exports = GiftcardManager;
