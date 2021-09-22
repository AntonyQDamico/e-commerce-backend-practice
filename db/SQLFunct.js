const db = require("./index.js");

function registerUser(userObject) {
  if (isValidUser(userObject)) {
    db.query(
      `INSERT INTO users (first_name, last_name, email, password)` +
        `VALUES ('${userObject.firstName}', '${userObject.lastName}', '${userObject.email}', '${userObject.password}');`,
      [],
      (err, result) => {
        if (err) {
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

async function findUserByEmail(email) {
  const user = await db.query(
    `SELECT * FROM users WHERE email = '${email}';`,
    [],
    (err, result) => {
      if (err) {
        throw new Error("Something went wrong with the request");
      }
      console.log(`Results.rows is: ${result.rows}`);
      return result.rows;
    }
  );
  console.log(`User Value returned :${user}`);
  return user;
}

module.exports = { registerUser, findUserByEmail };
