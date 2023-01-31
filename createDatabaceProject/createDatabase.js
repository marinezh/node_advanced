"use strict";

const Database = require("./database");

const printMessage = (message) => console.log(message);
const printStatement = (statement) => printMessage(`${statement};`);
const printError = (message) =>
  printMessage(
    `${"#".repeat(20)} Error ${"#".repeat(20)}\n` +
      `${message}\n${"#".repeat(47)}`
  );

let createStatementFile = "./createStatement.json";
let adminPass = "adminpass";

if (process.argv.length > 2) {
  adminPass = process.argv[2];
  if (process.argv.length > 3) {
    createStatementFile = `./${process.argv[3]}`;
  }
}

// console.log(createStatementFile, adminPass);

try {
  createDB(require(createStatementFile), adminPass);
} catch (error) {
  printError(error.message);
}

async function createDB(createStatement, adminPass) {
  const options = {
    host: createStatement.host,
    port: createStatement.port,
    user: createStatement.admin,
    password: adminPass,
    allowPublicKeyRetrieval: createStatement.allowPublicKeyRetrieval,
  };
  const DEBUG = createStatement.debug;
  const db = new Database(options);

  // 'jane'@'localhost'

  const user = `'${createStatement.user}'@'${createStatement.host}'`;
  const dropDatabaseSql = `drop database if exists ${createStatement.database}`;
  const createDatabaseSql = `create database ${createStatement.database}`;
  const dropUserSql = `drop user if exists ${user}`;
  const createUserSql =
    `create user if not exists ${user} ` +
    `indentified by '${createStatement.userpassword}'`;
  const grantPrivilegesSql = `grant all privileges on ${createStatement.database}.* to ${user}`;

  try {
    await db.doQuery(dropDatabaseSql);
    if (DEBUG) printStatement(dropDatabaseSql);
    await db.doQuery(createDatabaseSql);
    if (DEBUG) printStatement(createDatabaseSql);
    if (createStatement.dropUser) {
      await db.doQuery(dropUserSql);
      if (DEBUG) printStatement(dropUserSql);
    }
    await db.doQuery(createUserSql);
    if (DEBUG) printStatement(createUserSql);
    await db.doQuery(grantPrivilegesSql);
    if (DEBUG) printStatement(grantPrivilegesSql);

    for (let table of createStatement.tables) {
      if (table.columns && table.columns.length > 0) {
        const createTableSql =
          `create table ${createStatement.database}.${table.tableName} (` +
          `\n\t${table.columns.join(",\n\t")}` +
          `\n`;
        await db.doQuery(createTableSql);
        if (DEBUG) printStatement(createTableSql);
        if (table.data && table.data.length > 0) {
          const rows = [];
          for (const data of table.data) {
            const insertRowSql =
              `insert into ${createStatements.database}.${table.tableName} ` +
              `values(${Array(data.length).fill("?").join(", ")})`;
            if (DEBUG) printStatement(insertRowSql + "\t" + data.join(", "));
            rows.push(db.doQuery(insertRowSql, data));
          }
          // Waiting for all rows to be inserted
          await Promise.all(rows);
          if (DEBUG) printMessage("Data added");
        } else {
          if (DEBUG) printMessage("Data missing.");
        }
      } else {
        if (DEBUG)
          printMessage("Table columns missing. Table was not created.");
      }
    }
  } catch (error) {
    printError(error);
  }
}
