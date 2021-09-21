const expect = require("chai").expect;
const request = require("supertest");

const app = require("../server.js");

describe("/api/register/ routes", () => {
  describe("POST /api/register", () => {
    it("should add a new user if all supplied information is correct", function () {
      let newUserObject = {
        first_name: "Test",
        last_name: "Alsotest",
        email: "alsotest.test@test.com",
        password: "P4ssw0rd123",
      };
      return request(app)
        .post("/api/register")
        .send(newUserObject)
        .expect(201)
        .then((response) => response.body)
        .then((createdUser) => {
          newUserObject.id = createdUser.id;
          expect(newUserObject).to.be.deep.equal(createdUser);
        });
    });
  });
});
