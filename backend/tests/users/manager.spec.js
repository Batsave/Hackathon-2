// Import required dependencies
const { database, tables } = require("../setup");

// Test suite for the create method of ItemManager
describe("Create user", () => {
  it("should create an user successfully", async () => {
    // Define a sample item for testing
    const testUser = {
      firstname: "Prenom",
      lastname: "Nom",
      email: "nom.prenom@wcs.com",
      password: "Azerty1234",
      logged_in: false,
      isAdmin: true,
      birthday: "2023-12-19",
    };

    // Send a create request to the item table with a test item
    const insertId = await tables.users.create(testUser);

    // Check if the newly added item exists in the database
    const [rows] = await database.query(
      "select * from users where id = ?",
      insertId
    );

    const foundItem = rows[0];

    // Assertions
    expect(foundItem).toBeDefined();
    expect(foundItem).toHaveProperty("id");
    expect(foundItem).toHaveProperty("firstname");
    expect(foundItem).toHaveProperty("lastname");
    expect(foundItem).toHaveProperty("email");
    expect(foundItem).toHaveProperty("password");
    expect(foundItem).toHaveProperty("logged_in");
    expect(foundItem).toHaveProperty("isAdmin");
    expect(typeof foundItem.id).toEqual("number");
    expect(typeof foundItem.firstname).toEqual("string");
    expect(typeof foundItem.lastname).toEqual("string");
    expect(typeof foundItem.email).toEqual("string");
    expect(typeof foundItem.password).toEqual("string");
    expect(typeof foundItem.logged_in).toEqual("number");
    expect(typeof foundItem.isAdmin).toEqual("number");
    expect(foundItem.firstname).toBe(testUser.firstname);
    expect(foundItem.lastname).toBe(testUser.lastname);
    expect(foundItem.email).toBe(testUser.email);
    expect(foundItem.password).toBe(testUser.password);
    expect(foundItem.logged_in).toBe(testUser.logged_in === true ? 1 : 0);
    expect(foundItem.isAdmin).toBe(testUser.isAdmin === true ? 1 : 0);
  });

  it("should throw when passing invalid object", async () => {
    // Thx https://jestjs.io/docs/asynchronous#asyncawait

    // Send a create request to the item table with an empty object
    const promise = tables.users.create({});

    // Assertions
    await expect(promise).rejects.toThrow();
  });
});

describe("Update user", () => {
  it("should update an user successfully", async () => {
    // Define a sample item for testing
    const testUser = {
      firstname: "Prenom",
      lastname: "Nom",
      email: "test@test.com",
      password: "Azerty1234",
      logged_in: false,
      isAdmin: true,
    };
    // Send a create request to the item table with a test item
    const insertId = await tables.users.create(testUser);

    // Check if the newly added item exists in the database

    const updatedUser = {
      firstname: "John",
      lastname: "Doe",
      email: "nom.prenom@test.com",
      password: "Azerty1234",
      logged_in: false,
      isAdmin: true,
    };

    const response = await tables.users.update(insertId, updatedUser);

    console.info(response);
  });
  //   const [rows] = await database.query(
  //     "select * from users where id = ?",
  //     response
  //   );
  //   const foundItem = rows[0];

  //   // Assertions
  //   expect(foundItem).toBeDefined();
  //   expect(foundItem).toHaveProperty("id");
  //   expect(foundItem).toHaveProperty("firstname");
  //   expect(foundItem).toHaveProperty("lastname");
  //   expect(foundItem).toHaveProperty("email");
  //   expect(foundItem).toHaveProperty("password");
  //   expect(foundItem).toHaveProperty("logged_in");
  //   expect(foundItem).toHaveProperty("isAdmin");
  //   expect(typeof foundItem.id).toEqual("number");
  //   expect(typeof foundItem.firstname).toEqual("string");
  //   expect(typeof foundItem.lastname).toEqual("string");
  //   expect(typeof foundItem.email).toEqual("string");
  //   expect(typeof foundItem.password).toEqual("string");
  //   expect(typeof foundItem.logged_in).toEqual("number");
  //   expect(typeof foundItem.isAdmin).toEqual("number");
  //   expect(foundItem.firstname).toBe(testUser.firstname);
  //   expect(foundItem.lastname).toBe(testUser.lastname);
  //   expect(foundItem.email).toBe(testUser.email);
  //   expect(foundItem.password).toBe(testUser.password);
  //   expect(foundItem.logged_in).toBe(testUser.logged_in === true ? 1 : 0);
  //   expect(foundItem.isAdmin).toBe(testUser.isAdmin === true ? 1 : 0);
});
