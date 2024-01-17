const AbstractManager = require("./AbstractManager");

class UserManager extends AbstractManager {
  constructor() {
    super({ table: "users" });
  }

  // The C of CRUD - Create operation

  async create(user, hashedPassword) {
    const [result] = await this.database.query(
      `insert into ${this.table} (nom, prenom, email, password)
             values (?, ?, ?, ?)`,
      [user.nom, user.prenom, user.email, hashedPassword]
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

  async update(id, updatedUser) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET )prenom=?,
    nom=?,
    email=?,
    password=? WHERE id=? `,
      [
        updatedUser.firstname,
        updatedUser.lastname,
        updatedUser.email,
        updatedUser.password,
        id,
      ]
    );
    console.info(result);
    return result;
  }

  async signIn(email) {
    const [user] = await this.database.query(
      `SELECT * FROM user WHERE email = ?`,
      [email]
    );
    return user;
  }

  async saveToken(token, email) {
    const [result] = await this.database.query(
      `UPDATE user SET token=? WHERE email=?`,
      [token, email]
    );
    return result;
  }

  async setLastConnexion(date, email) {
    const [result] = await this.database.query(
      `UPDATE user SET last_login=? WHERE email=?`,
      [date, email]
    );
    return result;
  }

  async checkToken(token) {
    const [user] = await this.database.query(
      `SELECT * FROM user WHERE token = ?`,
      [token]
    );
    return user;
  }

  async deleteToken(token) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET token=NULL WHERE token=? `,
      [token]
    );
    console.info(result);
    return result;
  }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an item by its ID
}

module.exports = UserManager;
