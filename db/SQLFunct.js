const db = require("./index.js");

function registerUser(userObject) {
  if (isValidUser(userObject)) {
    console.log(userObject.firstName);
    console.log(userObject.lastName);
    console.log(userObject.email);
    console.log(userObject.password);
    db.query(
      `INSERT INTO users (first_name, last_name, email, password)` +
        `VALUES ('${userObject.firstName}', '${userObject.lastName}', '${userObject.email}', '${userObject.password}');`,
      [],
      (err, result) => {
        if (err) {
          console.log(err);
          throw new Error("Something went wrong with the request");
        }
        return result;
      }
    );
  }
  return null;
}
function isValidUser(instance) {
  instance.firstName = instance.firstName || "";
  instance.lastName = instance.lastName || "";
  instance.email = instance.email || "";
  instance.password = instance.password || "";
  if (
    typeof instance.firstName !== "string" ||
    typeof instance.lastName !== "string" ||
    typeof instance.email !== "string" ||
    typeof instance.password !== "string"
  ) {
    throw new Error("user input data must be type string");
  }

  return true;
}

module.exports = { registerUser };
