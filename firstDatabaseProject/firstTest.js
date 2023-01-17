"use strict";

const mariadb = require("mariadb");

// run testA function
testA();

//helpers functions

async function testA() {
  const options = {
    host: "127.0.0.1",
    port: 3306,
    user: "zeke",
    password: "1234",
    database: "employeeDb",
    allowPublicKeyRetrieval: true,
  };
  const connection = await mariadb.createConnection(options);

  let result = await connection.query("select * from employee");
  console.log(result);
  delete result.meta; // removing meta from result
  console.log(result);

  //close connection
  connection.end();
}
