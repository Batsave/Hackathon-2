// Import required dependencies
const { app, request, tables } = require("../setup");

// Test suite for the GET /api/clients route
describe("GET /api/client", () => {
  it("should fetch clients successfully", async () => {
    // Define a sample item for testing
    const testClient = {
      nom: "John",
      prenom: "Doe",
      email: "john.doe@bsprod.fr",
      telephone: "0607080900",
      adresse: "1 rue de la paix",
      code_postal: "75000",
      ville: "Paris",
    };

    // Create a sample item in the database
    const insertId = await tables.client.create(testClient);

    // Send a GET request to the /api/clients endpoint
    const response = await request(app).get("/api/client");

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    // Check if the created item is present in the response
    const foundItem = response.body.find((client) => client.id === insertId);

    // Assertions
    expect(foundItem).toBeInstanceOf(Object);
    expect(foundItem.firstname).toBe(testClient.firstname);
  });
});

// Test suite for the GET /api/clients/:id route
describe("GET /api/client/:id", () => {
  it("should fetch a single item successfully", async () => {
    // Define a sample item for testing
    const testClient = {
      nom: "John",
      prenom: "Doe",
      email: "john.doe@bsprod.fr",
      telephone: "0607080900",
      adresse: "1 rue de la paix",
      code_postal: "75000",
      ville: "Paris",
    };

    // Create a sample item in the database
    const insertId = await tables.client.create(testClient);

    // Send a GET request to the /api/clients/:id endpoint
    const response = await request(app).get(`/api/clients/${insertId}`);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.id).toBe(insertId);
    expect(response.body.firstname).toBe(testClient.firstname);
  });

  it("should return 404 for non-existent item", async () => {
    // Send a GET request to the /api/clients/:id endpoint with an invalid ID
    const response = await request(app).get("/api/clients/0");

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({});
  });
});

// Test suite for the POST /api/clients route
// Doesn't pass: maybe something to change in app config :/
// Hint: enabling log could help ;)
describe("POST /api/client", () => {
  it("should add a new client successfully", async () => {
    // Define a sample item for testing
    const testClient = {
      nom: "John",
      prenom: "Doe",
      email: "john.doe@bsprod.fr",
      telephone: "0607080900",
      adresse: "1 rue de la paix",
      code_postal: "75000",
      ville: "Paris",
    };

    // Send a POST request to the /api/clients endpoint with a test item
    const response = await request(app).post("/api/client").send(testClient);

    // Assertions
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.insertId).toEqual(expect.any(Number));

    // Check if the newly added item exists in the database
    const foundItem = await tables.clients.read(response.body.insertId);

    // Assertions
    expect(foundItem).toBeDefined();
    expect(foundItem.firstname).toBe(testClient.firstname);
  });
});

// TODO: implement PUT and DELETE routes

/*
// Test suite for the PUT /api/client/:id route
describe("PUT /api/client/:id", () => {
  it("should update an existing item successfully", async () => {
    // Define a sample item for testing
    const testItem = {
      title: "Sample Item",
    };

    // Create a sample item in the database
    const insertId = await tables.item.create(testItem);

    // Define an updated item object
    const updatedItem = {
      title: "Updated Item",
    };

    // Send a PUT request to the /api/client/:id endpoint with updated data
    const response = await request(app)
      .put(`/api/clients/${insertId}`)
      .send(updatedItem);

    // Assertions
    expect(response.status).toBe(204);

    // Check if the item has been updated in the database
    const foundItem = await tables.item.read(insertId);

    // Assertions
    expect(foundItem).toBeDefined();
    expect(foundItem.title).toBe(updatedItem.title);
  });
});

// Test suite for the DELETE /api/client/:id route
describe("DELETE /api/client/:id", () => {
  it("should delete an existing item successfully", async () => {
    // Define a sample item for testing
    const testItem = {
      title: "Sample Item",
    };

    // Create a sample item in the database
    const insertId = await tables.item.create(testItem);

    // Send a DELETE request to the /api/client/:id endpoint
    const response = await request(app).delete(`/api/clients/${insertId}`);

    // Assertions
    expect(response.status).toBe(204);

    // Check if the item has been deleted from the database
    const foundItem = await tables.item.read(insertId);

    // Assertions
    expect(foundItem).toBeUndefined();
  });
});
*/
