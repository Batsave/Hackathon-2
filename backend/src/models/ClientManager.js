const AbstractManager = require("./AbstractManager");

class ClientManager extends AbstractManager {
  constructor() {
    super({ table: "client" });
  }

  // The C of CRUD - Create operation

  async create(client) {
    const [result] = await this.database.query(
      `insert into ${this.table} (nom, prenom, email, telephone, adresse,
                                         code_postal, ville, notes)
             values (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client.nom.trim(),
        client.prenom.trim(),
        client.email.trim(),
        client.telephone.trim(),
        client.adresse,
        client.code_postal,
        client.ville,
        client.notes,
      ]
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

  async readIfEmail() {
    const [rows] = await this.database.query(`select *
                                                  from ${this.table}
                                                  where email != '' || email != null `);

    console.info(rows);
    return rows;
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing item

  async update(id, updatedClient) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET nom=?,
    prenom=?,
    email=?,
    telephone=?,
    adresse=?,
    code_postal=?, 
    ville=?,
    notes=? WHERE id=? `,
      [
        updatedClient.nom.trim(),
        updatedClient.prenom.trim(),
        updatedClient.email.trim(),
        updatedClient.telephone.trim(),
        updatedClient.adresse,
        updatedClient.code_postal,
        updatedClient.ville,
        updatedClient.notes,
        id,
      ]
    );
    console.info(result);
    return result;
  }

  async emailCheck(email) {
    if (email) {
      const [client] = await this.database.query(
        `SELECT * FROM client WHERE email = ?`,
        [email.trim()]
      );
      return client;
    }
    return [];
  }

  async clientNameCheck(nom, prenom) {
    if (nom && prenom) {
      const [client] = await this.database.query(
        `SELECT * FROM client WHERE nom = ? AND prenom = ?`,
        [nom.trim(), prenom.trim()]
      );
      return client;
    }
    return [];
  }

  async telephoneCheck(telephone) {
    if (telephone) {
      const [client] = await this.database.query(
        `SELECT * FROM client WHERE telephone = ?`,
        [telephone.trim()]
      );
      return client;
    }
    return [];
  }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an item by its ID

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

module.exports = ClientManager;
