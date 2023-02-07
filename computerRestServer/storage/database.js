"use strict";

const mariadb = require("mariadb");

module.exports = class Database {
  constructor(options) {
    // Ideally there would be error check here
    this.options = options;
  }

  doQuery(sql, parameters) {
    return new Promise(async (resolve, reject) => {
      let connection;
      try {
        connection = await mariadb.createConnection(this.options);
        let queryResult = await connection.query(sql, parameters);
        if (typeof queryResult === "undefined") {
          reject("QueryError");
        } else if (typeof queryResult.affectedRows === "undefined") {
          delete queryResult.meta;
          // here it could be queryResult:queryResult, but this is a shorter version
          resolve({ queryResult, resultSet: true });
        } else {
          resolve({
            queryResult: {
              rowsChanged: queryResult.affectedRows,
              insertId: queryResult.insertId,
              status: queryResult.warningStatus,
            },
            resultSet: false,
          });
        }
      } catch (err) {
        reject("SQL-error: " + err);
      } finally {
        if (connection) connection.end();
      }
    });
  }
};
